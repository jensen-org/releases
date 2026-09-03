<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { prefersReducedMotion } from '../lib/motion'
import {
  DOT_ALPHA, DOT_FADE, DURATION, RING_BACK, RING_OUT, VEIL_CAP,
  buildField, readSchedule, sampleSeeds, window01,
  type Field,
} from '../lib/diffusion'

const IGNITION_FLOOR = 2000
const FIRST_DELAY = [5000, 10000]
const INTERVAL = [15000, 40000]
const DEFER = 6000
const STEP = 1 / 60
const MAX_STEPS = 4
const BUILD_BUDGET = 6

const active = ref(false)
const canvas = ref<HTMLCanvasElement | null>(null)
const dots = ref<HTMLCanvasElement | null>(null)

const level = document.createElement('canvas')
let field: Field | null = null
let context: CanvasRenderingContext2D | null = null
let dotContext: CanvasRenderingContext2D | null = null
let levelContext: CanvasRenderingContext2D | null = null
let coverage: ImageData | null = null
let discs = new Map<number, HTMLCanvasElement>()
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
let building = false

const between = ([low, high]: number[]) => low + Math.random() * (high - low)

const held = () => {
  const focused = document.activeElement
  if (focused instanceof HTMLElement && focused.closest('.shelf-card, .hero-learn')) return true
  return Boolean(document.querySelector('.shelf-card:hover, .hero-learn:hover'))
}

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

// The ring keeps drawing exactly as it always has; only the element's opacity moves, so the
// dots empty out of the lattice and return without the ring knowing. It goes on the element
// rather than on :root, where a custom property would invalidate the whole document each frame.
let ringElement: HTMLElement | null = null

function ringInk(value: number) {
  if (ringElement) ringElement.style.opacity = value.toFixed(3)
}

function releaseRing() {
  if (ringElement) ringElement.style.removeProperty('opacity')
  ringElement = null
}

function paintInk(progress: number) {
  if (!context || !levelContext || !coverage || !field) return
  field.coverage(coverage.data, progress)
  levelContext.putImageData(coverage, 0, 0)
  context.globalCompositeOperation = 'copy'
  context.globalAlpha = 1
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(level, 0, 0, width, height)
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
  for (let i = 0; i < dotCount; i += 1) dotContext.drawImage(mark, dotX[i] - half, dotY[i] - half)
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
    field?.step(STEP, progress)
    paintInk(progress)
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
  building = false
  field = null
  context = null
  dotContext = null
  levelContext = null
  coverage = null
  releaseRing()
  discs = new Map()
  active.value = false
}

const nextFrame = () => new Promise<void>((resolve) => { frame = requestAnimationFrame(() => resolve()) })

async function ignite() {
  const ring = document.querySelector<HTMLCanvasElement>('.signal-ring')
  if (!ring || active.value || building) return
  const rect = ring.getBoundingClientRect()
  if (rect.width === 0) return
  const scale = Math.min(1, VEIL_CAP / Math.max(window.innerWidth, window.innerHeight))
  width = Math.round(window.innerWidth * scale)
  height = Math.round(window.innerHeight * scale)
  const seeds = sampleSeeds(ring, rect, scale)
  if (seeds.points.length === 0) return

  // Build the noise landscape a slice per frame before anything is mounted or drawn.
  // Doing it in one go costs about twenty milliseconds, which the ring loses as a stall.
  building = true
  const build = buildField(seeds, width, height)
  let step = build.next()
  while (!step.done) {
    await nextFrame()
    if (!building) return
    const until = performance.now() + BUILD_BUDGET
    while (!step.done && performance.now() < until) step = build.next()
  }
  building = false
  const ready = step.value

  active.value = true
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  const element = canvas.value
  const dotElement = dots.value
  if (!element || !dotElement) return stop()
  element.width = width
  element.height = height
  dotElement.width = width
  dotElement.height = height
  context = element.getContext('2d')
  dotContext = dotElement.getContext('2d')
  if (!context || !dotContext) return stop()
  context.clearRect(0, 0, width, height)
  dotRadius = Math.max(1, (Math.min(rect.width, rect.height) / 300) * scale)

  field = ready
  ringElement = ring
  level.width = field.columns
  level.height = field.rows
  levelContext = level.getContext('2d')
  if (!levelContext) return stop()
  coverage = levelContext.createImageData(field.columns, field.rows)

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
    if (active.value || building) stop()
    return
  }
  if (!active.value && !building) schedule(between(INTERVAL))
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
