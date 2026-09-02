<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { createRingSim, dotRadius, generateGeometry, visibleDots, type RingSim } from '../lib/ring'

const INK = '#0E0E0D'
const STEP = 1 / 60
const MAX_STEPS = 4

const canvas = ref<HTMLCanvasElement | null>(null)
let sim: RingSim | null = null
let still: Float64Array = new Float64Array(0)
let observer: IntersectionObserver | undefined
let onResize: (() => void) | undefined
let frame = 0
let running = false
let reduced = false
let last = 0
let carry = 0
let side = 0

function build(next: number) {
  if (reduced) {
    const dots = visibleDots(generateGeometry(next, next))
    still = new Float64Array(dots.length * 2)
    dots.forEach((dot, i) => { still[i * 2] = dot.x; still[i * 2 + 1] = dot.y })
    return
  }
  if (sim) sim.resize(next)
  else sim = createRingSim(next, visibleDots(generateGeometry(next, next)))
}

function render() {
  const element = canvas.value
  const context = element?.getContext('2d')
  if (!element || !context) return
  const width = element.clientWidth
  const height = element.clientHeight
  if (width === 0 || height === 0) return
  const ratio = window.devicePixelRatio || 1
  const next = Math.min(width, height)
  if (next !== side) {
    side = next
    build(side)
  }
  const pixelWidth = Math.round(width * ratio)
  const pixelHeight = Math.round(height * ratio)
  if (element.width !== pixelWidth || element.height !== pixelHeight) {
    element.width = pixelWidth
    element.height = pixelHeight
  }
  const points = sim ? sim.positions : still
  const total = points.length / 2
  const radius = dotRadius(side)
  const offsetX = (width - side) / 2
  const offsetY = (height - side) / 2
  const fading = Boolean(sim) && !sim!.revealed
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.clearRect(0, 0, width, height)
  context.globalAlpha = 1
  context.fillStyle = INK
  for (let i = 0; i < total; i += 1) {
    if (fading) {
      const reveal = sim!.alpha[i]
      if (reveal === 0) continue
      context.globalAlpha = reveal
    }
    context.beginPath()
    context.arc(offsetX + points[i * 2], offsetY + points[i * 2 + 1], radius, 0, Math.PI * 2)
    context.fill()
  }
  context.globalAlpha = 1
}

function tick(now: number) {
  frame = 0
  if (!running) return
  carry += Math.min(0.25, (now - last) / 1000)
  last = now
  let steps = 0
  while (carry >= STEP && steps < MAX_STEPS) {
    sim?.step(STEP)
    carry -= STEP
    steps += 1
  }
  if (carry > STEP) carry = 0
  render()
  frame = requestAnimationFrame(tick)
}

function setRunning(value: boolean) {
  if (reduced || running === value) return
  running = value
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  if (!running) return
  last = performance.now()
  carry = 0
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  render()
  observer = new IntersectionObserver((entries) => setRunning(Boolean(entries[0]?.isIntersecting)))
  if (canvas.value) observer.observe(canvas.value)
  onResize = () => render()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  observer?.disconnect()
  running = false
  if (frame) cancelAnimationFrame(frame)
  if (onResize) window.removeEventListener('resize', onResize)
})
</script>

<template>
  <canvas ref="canvas" class="signal-ring" role="img" aria-label="Jensen signal ring" />
</template>
