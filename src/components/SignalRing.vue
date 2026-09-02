<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { encodeMessage, generateGeometry, revealFactor, scanState, visibleDots, type Dot } from '../lib/ring'

const canvas = ref<HTMLCanvasElement | null>(null)
let observer: IntersectionObserver | undefined
let resize: (() => void) | undefined
let frame = 0
let active = false
let reduced = false
let startedAt = 0
const dots = ref<Dot[]>([])

function draw(time = 0) {
  const element = canvas.value
  const context = element?.getContext('2d')
  if (!element || !context) return
  if (!startedAt) startedAt = time
  const elapsed = time - startedAt
  const width = element.clientWidth
  const height = element.clientHeight
  const ratio = window.devicePixelRatio || 1
  if (element.width !== Math.round(width * ratio) || element.height !== Math.round(height * ratio)) {
    element.width = Math.round(width * ratio)
    element.height = Math.round(height * ratio)
    dots.value = generateGeometry(width, height, encodeMessage())
  }
  const side = Math.min(width, height)
  const radius = Math.max(1.4, side / 200)
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.clearRect(0, 0, width, height)
  context.fillStyle = '#0E0E0D'
  for (const dot of visibleDots(dots.value)) {
    const state = scanState(dot, elapsed, reduced)
    context.globalAlpha = state.opacity * revealFactor(dot, elapsed, reduced)
    context.beginPath()
    context.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
    context.fill()
  }
  context.globalAlpha = 1
  if (active && !reduced) frame = requestAnimationFrame(draw)
}

function setActive(value: boolean) {
  if (active === value) return
  active = value
  cancelAnimationFrame(frame)
  if (active) frame = requestAnimationFrame(draw)
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  observer = new IntersectionObserver((entries) => setActive(Boolean(entries[0]?.isIntersecting)))
  if (canvas.value) observer.observe(canvas.value)
  resize = () => draw()
  window.addEventListener('resize', resize)
  draw()
})

onUnmounted(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
  if (resize) window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas ref="canvas" class="signal-ring" role="img" aria-label="Jensen signal ring" />
</template>
