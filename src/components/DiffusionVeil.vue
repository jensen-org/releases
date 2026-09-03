<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { prefersReducedMotion } from '../lib/motion'
import {
  DOT_ALPHA, DOT_FADE, DURATION, GAIN_POW, GAIN_RATE, MARK_ALPHA,
  MARK_ALPHA_POW, MARK_RADIUS, MARK_RADIUS_POW, RING_BACK, RING_OUT, SIDE_WEIGHT,
  SPREAD, SPREAD_POW, VEIL_CAP, createField, ramp, readSchedule, sampleSeeds, window01,
  type Field,
} from '../lib/diffusion'

const REF_REACH = 900
const IGNITION_FLOOR = 2000
const FIRST_DELAY = [30000, 50000]
const INTERVAL = [25000, 45000]
const DEFER = 6000
const STEP = 1 / 60
const MAX_STEPS = 4

const active = ref(false)
const canvas = ref<HTMLCanvasElement | null>(null)
const dots = ref<HTMLCanvasElement | null>(null)

const scratch = document.createElement('canvas')
let field: Field | null = null
let context: CanvasRenderingContext2D | null = null
let dotContext: CanvasRenderingContext2D | null = null
let scratchContext: CanvasRenderingContext2D | null = null
let sprites = new Map<number, HTMLCanvasElement>()
let timer = 0
let frame = 0
let last = 0
let carry = 0
let elapsed = 0
let closing = false
let width = 0
let height = 0
let mounted = 0
let dotRadius = 1

const between = ([low, high]: number[]) => low + Math.random() * (high - low)

const held = () => {
  const focused = document.activeElement
  if (focused instanceof HTMLElement && focused.closest('.shelf-card, .hero-learn')) return true
  return Boolean(document.querySelector('.shelf-card:hover, .hero-learn:hover'))
}

// A soft round mark, cached per radius. Used for both the filament marks and the dots,
// because per-particle arc() and fill() will not hold sixty frames at these counts.
function sprite(radius: number): HTMLCanvasElement {
  const key = Math.round(radius * 2)
  const cached = sprites.get(key)
  if (cached) return cached
  const size = Math.max(2, Math.ceil(key / 2) * 2 + 2)
  const mark = document.createElement('canvas')
  mark.width = mark.height = size
  const ink = mark.getContext('2d')!
  const gradient = ink.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.45)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ink.fillStyle = gradient
  ink.fillRect(0, 0, size, size)
  sprites.set(key, mark)
  return mark
}

// Bleed the ink one step outward, then amplify it. A normalised cross rather than
// ctx.filter blur, which this project cannot rely on: Chrome under mobile emulation
// does not expose it at all, and the transition silently never started there.
// The dots keep the ring's own hard edge; only the filament marks are soft.
const discs = new Map<number, HTMLCanvasElement>()

function disc(radius: number): HTMLCanvasElement {
  const key = Math.round(radius * 2)
  const cached = discs.get(key)
  if (cached) return cached
  const size = Math.max(2, Math.ceil(radius) * 2 + 2)
  const mark = document.createElement('canvas')
  mark.width = mark.height = size
  const ink = mark.getContext('2d')!
  ink.fillStyle = '#fff'
  ink.beginPath()
  ink.arc(size / 2, size / 2, radius, 0, Math.PI * 2)
  ink.fill()
  discs.set(key, mark)
  return mark
}

function grow(progress: number, dt: number) {
  if (!context || !scratchContext || !field) return
  const veil = canvas.value!
  const spread = Math.max(1, Math.round(ramp(SPREAD, progress, SPREAD_POW) * (field.reach / REF_REACH)))
  const gain = ramp(GAIN_RATE, progress, GAIN_POW) * dt
  scratchContext.globalCompositeOperation = 'copy'
  scratchContext.globalAlpha = 1 - 4 * SIDE_WEIGHT
  scratchContext.drawImage(veil, 0, 0)
  scratchContext.globalCompositeOperation = 'lighter'
  scratchContext.globalAlpha = SIDE_WEIGHT
  scratchContext.drawImage(veil, -spread, 0)
  scratchContext.drawImage(veil, spread, 0)
  scratchContext.drawImage(veil, 0, -spread)
  scratchContext.drawImage(veil, 0, spread)
  context.globalCompositeOperation = 'copy'
  context.globalAlpha = 1
  context.drawImage(scratch, 0, 0)
  if (gain <= 0) return
  context.globalCompositeOperation = 'lighter'
  context.globalAlpha = gain
  context.drawImage(scratch, 0, 0)
  context.globalAlpha = 1
}

function paint(progress: number) {
  if (!context || !field) return
  const unit = field.reach / REF_REACH
  const radius = ramp(MARK_RADIUS, progress, MARK_RADIUS_POW) * unit
  context.globalCompositeOperation = 'lighter'
  context.globalAlpha = ramp(MARK_ALPHA, progress, MARK_ALPHA_POW)
  context.fillStyle = '#fff'
  const { x, y, count } = field
  if (radius < 1.5) {
    for (let i = 0; i < count; i += 1) context.fillRect(x[i] | 0, y[i] | 0, 1, 1)
  } else {
    const mark = sprite(radius)
    const half = mark.width / 2
    for (let i = 0; i < count; i += 1) context.drawImage(mark, (x[i] - half) | 0, (y[i] - half) | 0)
  }
  context.globalAlpha = 1
}

// The ring keeps drawing exactly as it always has; only the element's ink level moves,
// so the dots empty out of the lattice and return without the ring knowing.
function ringInk(level: number) {
  document.documentElement.style.setProperty('--ring-ink', level.toFixed(3))
}

function paintDots(progress: number) {
  if (!dotContext || !field) return
  dotContext.clearRect(0, 0, width, height)
  const alpha = DOT_ALPHA * (1 - window01(DOT_FADE, progress))
  if (alpha <= 0.002) return
  dotContext.globalAlpha = alpha
  const mark = disc(dotRadius)
  const half = mark.width / 2
  const { dotX, dotY, dotCount } = field
  for (let i = 0; i < dotCount; i += 1) {
    dotContext.drawImage(mark, (dotX[i] - half) | 0, (dotY[i] - half) | 0)
  }
  dotContext.globalAlpha = 1
}

function commit() {
  const root = document.documentElement
  const dark = root.dataset.theme === 'dark'
  if (dark) delete root.dataset.theme
  else root.dataset.theme = 'dark'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#fbfbf9' : '#040406')
  ringInk(1)
  dotContext?.clearRect(0, 0, width, height)
  context?.setTransform(1, 0, 0, 1, 0, 0)
  context!.globalCompositeOperation = 'source-over'
  context!.globalAlpha = 1
  context!.clearRect(0, 0, width, height)
  stop()
  schedule(between(INTERVAL))
}

function tick(now: number) {
  frame = 0
  carry += Math.min(0.25, (now - last) / 1000)
  last = now
  let steps = 0
  while (carry >= STEP && steps < MAX_STEPS) {
    elapsed += STEP
    const progress = Math.min(1, elapsed / DURATION)
    grow(progress, STEP)
    field?.step(STEP, progress)
    paint(progress)
    paintDots(progress)
    ringInk(1 - window01(RING_OUT, progress) * (1 - window01(RING_BACK, progress)))
    carry -= STEP
    steps += 1
  }
  if (carry > STEP) carry = 0
  if (closing) {
    commit()
    return
  }
  if (elapsed >= DURATION) {
    // Land on a uniformly white veil so the palette swap on the next frame is exact.
    context!.globalCompositeOperation = 'source-over'
    context!.globalAlpha = 1
    context!.fillStyle = '#fff'
    context!.fillRect(0, 0, width, height)
    closing = true
  }
  frame = requestAnimationFrame(tick)
}

function stop() {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  field = null
  context = null
  dotContext = null
  scratchContext = null
  document.documentElement.style.removeProperty('--ring-ink')
  sprites = new Map()
  active.value = false
}

async function ignite() {
  const ring = document.querySelector<HTMLCanvasElement>('.signal-ring')
  if (!ring || active.value) return
  const rect = ring.getBoundingClientRect()
  if (rect.width === 0) return
  const scale = Math.min(1, VEIL_CAP / Math.max(window.innerWidth, window.innerHeight))
  width = Math.round(window.innerWidth * scale)
  height = Math.round(window.innerHeight * scale)
  const seeds = sampleSeeds(ring, rect, scale)
  if (seeds.points.length === 0) return

  active.value = true
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  const element = canvas.value
  const dotElement = dots.value
  if (!element || !dotElement) return stop()
  element.width = width
  element.height = height
  dotElement.width = width
  dotElement.height = height
  scratch.width = width
  scratch.height = height
  context = element.getContext('2d')
  dotContext = dotElement.getContext('2d')
  scratchContext = scratch.getContext('2d')
  if (!context || !dotContext || !scratchContext) return stop()
  context.clearRect(0, 0, width, height)
  dotRadius = Math.max(1, (Math.min(rect.width, rect.height) / 300) * scale)

  field = createField(seeds, width, height)
  elapsed = 0
  carry = 0
  closing = false
  last = performance.now()
  frame = requestAnimationFrame(tick)
}

function schedule(delay: number) {
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    if (document.hidden) return schedule(4000)
    if (held()) return schedule(DEFER)
    if (performance.now() - mounted < IGNITION_FLOOR) return schedule(IGNITION_FLOOR)
    void ignite()
  }, delay)
}

function onVisibility() {
  if (document.hidden) {
    window.clearTimeout(timer)
    if (active.value) stop()
    return
  }
  if (!active.value) schedule(between(INTERVAL))
}

onMounted(() => {
  mounted = performance.now()
  if (prefersReducedMotion()) return
  const { enabled, force } = readSchedule(window.location.search)
  if (!enabled) return
  document.addEventListener('visibilitychange', onVisibility)
  if (force) Reflect.set(window, '__diffuse', () => { window.clearTimeout(timer); void ignite() })
  schedule(force ? IGNITION_FLOOR : between(FIRST_DELAY))
})

onUnmounted(() => {
  Reflect.deleteProperty(window, '__diffuse')
  window.clearTimeout(timer)
  document.removeEventListener('visibilitychange', onVisibility)
  stop()
})
</script>

<template>
  <template v-if="active">
    <canvas ref="canvas" class="diffusion-veil" aria-hidden="true" />
    <canvas ref="dots" class="diffusion-veil diffusion-dots" aria-hidden="true" />
  </template>
</template>
