<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { FLOW_GLSL } from '../lib/flow.glsl'
import { FLOATS_PER_VERTEX, buildFilamentMesh } from '../lib/filaments'
import { createPointerTracker, type PointerTracker } from '../lib/pointer'
import { hasCoarsePointer, prefersReducedMotion } from '../lib/motion'

const props = defineProps<{
  core: HTMLElement | null
  masthead: HTMLElement | null
  shelf: HTMLElement | null
}>()

const OUTER_RATIO = 0.99
const REVEAL_RATIO = 0.46
const INK_PEAK = 0.48
const SWAY = 55
const RENDER_SCALE = 1

const VERTEX_SOURCE = `#version 300 es
precision highp float;

in vec4 a_seed;
in vec3 a_shape;

uniform vec2 uResolution;
uniform vec2 uCore;
uniform float uCoreRadius;
uniform float uSpan;
uniform float uSway;
uniform float uTime;

out float v_t;
out float v_phase;
out float v_edge;
out float v_half;
out vec2 v_pos;
${FLOW_GLSL}
const float FLOW_SCALE = 2.4;
const float FLOW_PERIOD = 7.0;

vec2 filamentPoint(float angle, float t, float reach, float sway, float phase, float curve) {
  vec2 anchorDir = vec2(cos(angle), sin(angle));
  vec2 tangentDir = vec2(-anchorDir.y, anchorDir.x);
  float eased = t * t * (3.0 - 2.0 * t);
  float span = uSpan * reach;
  vec2 base = uCore + anchorDir * (uCoreRadius + span * eased) + tangentDir * (curve * span * eased * eased);
  vec2 field = (base - uCore) / max(uSpan, 1.0);
  vec2 shared = curl2(vec3(field * FLOW_SCALE, uTime / FLOW_PERIOD));
  vec2 own = curl2(vec3(field * 2.2 + vec2(phase * 137.0, phase * 211.0), uTime / 9.0));
  vec2 drift = shared * 0.28 + own * 0.72;
  return base + drift * uSway * sway * pow(t, 1.8);
}

void main() {
  float angle = a_seed.x;
  float t = a_seed.y;
  float side = a_seed.z;
  float reach = a_shape.x;
  float sway = a_shape.y;
  float curve = a_shape.z;

  float phase = a_seed.w;
  vec2 here = filamentPoint(angle, t, reach, sway, phase, curve);
  vec2 ahead = filamentPoint(angle, min(t + 0.015, 1.0), reach, sway, phase, curve);
  vec2 behind = filamentPoint(angle, max(t - 0.015, 0.0), reach, sway, phase, curve);
  vec2 tangent = normalize(ahead - behind + vec2(1e-5));
  vec2 normal = vec2(-tangent.y, tangent.x);

  float wanted = mix(0.85, 0.3, t);
  float drawn = wanted + 2.0;
  vec2 pos = here + normal * side * drawn * 0.5;

  v_t = t;
  v_phase = phase;
  v_edge = side * drawn * 0.5;
  v_half = wanted * 0.5;
  v_pos = pos;

  vec2 clip = (pos / uResolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`

const FRAGMENT_SOURCE = `#version 300 es
precision highp float;

in float v_t;
in float v_phase;
in float v_edge;
in float v_half;
in vec2 v_pos;

uniform vec2 uPointer;
uniform float uStrength;
uniform float uReveal;
uniform float uTime;
uniform float uInk;
uniform vec4 uMasthead;
uniform vec4 uShelf;

out vec4 outColor;

const vec3 INK = vec3(0.05490, 0.05490, 0.05098);

float bayer8(vec2 fragment) {
  ivec2 cell = ivec2(fragment);
  int x = cell.x & 7;
  int y = cell.y & 7;
  int a = x ^ y;
  int value = 0;
  value |= ((a >> 2) & 1);
  value |= ((y >> 2) & 1) << 1;
  value |= ((a >> 1) & 1) << 2;
  value |= ((y >> 1) & 1) << 3;
  value |= (a & 1) << 4;
  value |= (y & 1) << 5;
  return float(value) / 64.0;
}

float clearOf(vec2 p, vec4 box) {
  if (box.z <= 0.0) return 1.0;
  vec2 ext = box.zw * 0.5;
  vec2 away = abs(p - (box.xy + ext)) - ext;
  float outside = length(max(away, vec2(0.0))) + min(max(away.x, away.y), 0.0);
  return smoothstep(0.0, 26.0, outside);
}

void main() {
  float coverage = clamp(v_half - abs(v_edge) + 0.5, 0.0, 1.0);

  float row = floor(v_pos.y / 3.0);
  float tear = fract(sin(row * 12.9898 + floor(uTime * 11.0) * 3.7) * 43758.5453);
  vec2 torn = vec2(v_pos.x + (tear - 0.5) * 1.2, v_pos.y);
  float reveal = smoothstep(uReveal, 0.0, distance(torn, uPointer)) * uStrength;

  float head = smoothstep(0.0, 0.12, v_t);
  float tip = 1.0 - smoothstep(0.55, 1.0, v_t);
  float travel = 1.0 - fract(uTime * 0.16 + v_phase);
  float offset = (v_t - travel) / 0.09;
  float pulse = exp(-offset * offset);

  float alpha = coverage * head * tip * reveal * uInk * (1.0 + pulse * 1.5);
  alpha *= clearOf(v_pos, uMasthead) * clearOf(v_pos, uShelf);
  alpha *= 1.0 + (bayer8(gl_FragCoord.xy) - 0.5) * 0.55;
  alpha = clamp(alpha, 0.0, 1.0);
  if (alpha <= 0.0) discard;
  outColor = vec4(INK * alpha, alpha);
}
`

const canvas = ref<HTMLCanvasElement | null>(null)
let gl: WebGL2RenderingContext | null = null
let tracker: PointerTracker | null = null
let uniforms: Record<string, WebGLUniformLocation | null> = {}
let observer: ResizeObserver | undefined
let onResize: (() => void) | undefined
let onSettled: (() => void) | undefined
let indexCount = 0
let frame = 0
let running = false
let last = 0
let clock = 0
let span = 0

function compile(context: WebGL2RenderingContext, kind: number, source: string) {
  const shader = context.createShader(kind)
  if (!shader) return null
  context.shaderSource(shader, source)
  context.compileShader(shader)
  if (context.getShaderParameter(shader, context.COMPILE_STATUS)) return shader
  context.deleteShader(shader)
  return null
}

function setup(element: HTMLCanvasElement): WebGL2RenderingContext | null {
  const context = element.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  })
  if (!context) return null

  const vertex = compile(context, context.VERTEX_SHADER, VERTEX_SOURCE)
  const fragment = compile(context, context.FRAGMENT_SHADER, FRAGMENT_SOURCE)
  const program = vertex && fragment ? context.createProgram() : null
  if (!vertex || !fragment || !program) return null
  context.attachShader(program, vertex)
  context.attachShader(program, fragment)
  context.linkProgram(program)
  if (!context.getProgramParameter(program, context.LINK_STATUS)) return null
  context.useProgram(program)

  const mesh = buildFilamentMesh()
  indexCount = mesh.indexCount
  const array = context.createVertexArray()
  context.bindVertexArray(array)
  context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer())
  context.bufferData(context.ARRAY_BUFFER, mesh.vertices, context.STATIC_DRAW)
  const stride = FLOATS_PER_VERTEX * 4
  const seed = context.getAttribLocation(program, 'a_seed')
  const shape = context.getAttribLocation(program, 'a_shape')
  context.enableVertexAttribArray(seed)
  context.vertexAttribPointer(seed, 4, context.FLOAT, false, stride, 0)
  context.enableVertexAttribArray(shape)
  context.vertexAttribPointer(shape, 3, context.FLOAT, false, stride, 16)
  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, context.createBuffer())
  context.bufferData(context.ELEMENT_ARRAY_BUFFER, mesh.indices, context.STATIC_DRAW)

  for (const name of ['uResolution', 'uCore', 'uCoreRadius', 'uSpan', 'uSway', 'uTime', 'uPointer', 'uStrength', 'uReveal', 'uInk', 'uMasthead', 'uShelf']) {
    uniforms[name] = context.getUniformLocation(program, name)
  }

  context.enable(context.BLEND)
  context.blendFunc(context.ONE, context.ONE_MINUS_SRC_ALPHA)
  context.clearColor(0, 0, 0, 0)
  return context
}

function box(element: HTMLElement | null): [number, number, number, number] {
  if (!element) return [0, 0, 0, 0]
  const rect = element.getBoundingClientRect()
  return [rect.left, rect.top, rect.width, rect.height]
}

function resize() {
  const element = canvas.value
  if (!element || !gl) return
  const width = window.innerWidth
  const height = window.innerHeight
  const scale = Math.min(window.devicePixelRatio || 1, 2) * RENDER_SCALE
  element.width = Math.round(width * scale)
  element.height = Math.round(height * scale)
  gl.viewport(0, 0, element.width, element.height)
  gl.uniform2f(uniforms.uResolution!, width, height)

  const rect = props.core?.getBoundingClientRect()
  const side = rect ? Math.min(rect.width, rect.height) : Math.min(width, height) * 0.6
  const centreX = rect ? rect.left + rect.width / 2 : width / 2
  const centreY = rect ? rect.top + rect.height / 2 : height / 2
  const radius = (side / 2) * OUTER_RATIO
  span = Math.hypot(Math.max(centreX, width - centreX), Math.max(centreY, height - centreY)) - radius
  gl.uniform2f(uniforms.uCore!, centreX, centreY)
  gl.uniform1f(uniforms.uCoreRadius!, radius)
  gl.uniform1f(uniforms.uSpan!, Math.max(span, 1))
  gl.uniform1f(uniforms.uReveal!, Math.min(width, height) * REVEAL_RATIO)
  gl.uniform1f(uniforms.uSway!, SWAY)
  gl.uniform1f(uniforms.uInk!, INK_PEAK)
  gl.uniform4fv(uniforms.uMasthead!, box(props.masthead))
  gl.uniform4fv(uniforms.uShelf!, box(props.shelf))
}

function draw() {
  if (!gl || !tracker) return
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.uniform1f(uniforms.uTime!, clock)
  gl.uniform2f(uniforms.uPointer!, tracker.state.x, tracker.state.y)
  gl.uniform1f(uniforms.uStrength!, tracker.state.strength)
  gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0)
}

function tick(now: number) {
  frame = 0
  if (!running || !gl || !tracker) return
  const delta = Math.min(0.05, (now - last) / 1000)
  last = now
  clock += delta
  tracker.advance(delta)
  if (tracker.state.strength === 0) {
    running = false
    gl.clear(gl.COLOR_BUFFER_BIT)
    return
  }
  draw()
  frame = requestAnimationFrame(tick)
}

function wake() {
  if (running || !gl) return
  running = true
  last = performance.now()
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  const element = canvas.value
  if (!element) return
  if (prefersReducedMotion() || hasCoarsePointer()) return
  gl = setup(element)
  if (!gl) return
  resize()
  tracker = createPointerTracker(wake)
  onResize = () => resize()
  onSettled = () => resize()
  window.addEventListener('resize', onResize)
  observer = new ResizeObserver(() => resize())
  for (const target of [props.core, props.masthead, props.shelf]) {
    if (!target) continue
    observer.observe(target)
    target.addEventListener('animationend', onSettled)
  }
})

watch(() => [props.core, props.masthead, props.shelf], () => {
  if (!gl) return
  resize()
  for (const target of [props.core, props.masthead, props.shelf]) {
    if (!target) continue
    observer?.observe(target)
    if (onSettled) target.addEventListener('animationend', onSettled)
  }
})

onUnmounted(() => {
  running = false
  if (frame) cancelAnimationFrame(frame)
  observer?.disconnect()
  tracker?.dispose()
  if (onSettled) for (const target of [props.core, props.masthead, props.shelf]) target?.removeEventListener('animationend', onSettled)
  if (onResize) window.removeEventListener('resize', onResize)
})
</script>

<template>
  <canvas ref="canvas" class="filaments" aria-hidden="true" />
</template>
