<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { encodeMessage, generateGeometry, scanState, visibleDots, type Dot } from '../lib/eye'
const canvas = ref<HTMLCanvasElement | null>(null)
let observer: IntersectionObserver | undefined
let frame = 0
let active = false
let reduced = false
let resize: (() => void) | undefined
const dots = ref<Dot[]>([])
function draw(time = 0) { const element = canvas.value; const context = element?.getContext('2d'); if (!element || !context) return; const width = element.clientWidth; const height = element.clientHeight; const ratio = window.devicePixelRatio || 1; if (element.width !== Math.round(width * ratio) || element.height !== Math.round(height * ratio)) { element.width = Math.round(width * ratio); element.height = Math.round(height * ratio); dots.value = generateGeometry(width, height, encodeMessage()) } context.setTransform(ratio, 0, 0, ratio, 0, 0); context.clearRect(0, 0, width, height); context.fillStyle = '#111'; for (const dot of visibleDots(dots.value)) { const state = scanState(dot, time, reduced); context.globalAlpha = state.opacity; context.beginPath(); context.arc(dot.x, dot.y, Math.max(1.65, width / 235), 0, Math.PI * 2); context.fill() } context.globalAlpha = 1; if (active && !reduced) frame = requestAnimationFrame(draw) }
function setActive(value: boolean) { if (active === value) return; active = value; cancelAnimationFrame(frame); if (active) frame = requestAnimationFrame(draw) }
onMounted(() => { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; observer = new IntersectionObserver((entries) => setActive(Boolean(entries[0]?.isIntersecting))); if (canvas.value) observer.observe(canvas.value); resize = () => draw(); window.addEventListener('resize', resize); draw() })
onUnmounted(() => { observer?.disconnect(); cancelAnimationFrame(frame); if (resize) window.removeEventListener('resize', resize) })
</script>
<template>
  <canvas ref="canvas" class="scanning-eye" role="img" aria-label="Jensen scanning eye" />
</template>
