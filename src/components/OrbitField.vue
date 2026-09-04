<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { hasCoarsePointer, prefersReducedMotion } from '../lib/motion'

type Ring = { cx: number; cy: number; r: number }

const RINGS: Ring[] = [
  { cx: 50, cy: 50, r: 27 },
  { cx: 50, cy: 50, r: 41 },
]

const PINS = [
  { ring: 0, at: 'left', band: 0.14, label: 'Shared map', note: 'services, calls, routes' },
  { ring: 1, at: 'right', band: 0.1, label: 'Honest by design', note: 'it never guesses' },
  { ring: 0, at: 'right', band: 0.9, label: 'Git guard', note: 'secrets refused at commit' },
]

const host = ref<HTMLDivElement | null>(null)
const pins = ref<HTMLElement[]>([])
const sides = ref(PINS.map(() => 'right'))
const drift = ref<SVGGElement | null>(null)

let observer: ResizeObserver | undefined
let onPointer: ((event: PointerEvent) => void) | undefined
let frame = 0
let shiftX = 0
let shiftY = 0
let aimX = 0
let aimY = 0

const polar = (ring: Ring, angle: number, radius = ring.r) => ({
  x: ring.cx + Math.cos(angle) * radius,
  y: ring.cy + Math.sin(angle) * radius,
})

function place() {
  const box = host.value?.getBoundingClientRect()
  if (!box) return
  const scale = Math.max(box.width, box.height) / 100
  const originX = (box.width - 100 * scale) / 2
  const originY = (box.height - 100 * scale) / 2
  PINS.forEach((pin, index) => {
    const element = pins.value[index]
    if (!element) return
    const ring = RINGS[pin.ring]
    const height = (box.height * pin.band - originY) / scale
    const rise = Math.max(-1, Math.min(1, (height - ring.cy) / ring.r))
    const right = Math.asin(rise)
    const point = polar(ring, pin.at === 'right' ? right : Math.PI - right)
    const x = originX + point.x * scale
    element.style.left = `${x}px`
    element.style.top = `${originY + point.y * scale}px`
    sides.value[index] = x > box.width / 2 ? 'left' : 'right'
  })
}

function ease(now: number) {
  frame = 0
  shiftX += (aimX - shiftX) * 0.06
  shiftY += (aimY - shiftY) * 0.06
  drift.value?.setAttribute('transform', `translate(${shiftX.toFixed(3)} ${shiftY.toFixed(3)})`)
  if (Math.abs(aimX - shiftX) > 0.002 || Math.abs(aimY - shiftY) > 0.002) frame = requestAnimationFrame(ease)
  void now
}

onMounted(() => {
  place()
  observer = new ResizeObserver(() => place())
  if (host.value) observer.observe(host.value)
  if (prefersReducedMotion() || hasCoarsePointer()) return
  onPointer = (event) => {
    aimX = (event.clientX / window.innerWidth - 0.5) * 1.6
    aimY = (event.clientY / window.innerHeight - 0.5) * 1.6
    if (!frame) frame = requestAnimationFrame(ease)
  }
  window.addEventListener('pointermove', onPointer, { passive: true })
})

onUnmounted(() => {
  observer?.disconnect()
  if (frame) cancelAnimationFrame(frame)
  if (onPointer) window.removeEventListener('pointermove', onPointer)
})
</script>

<template>
  <div ref="host" class="orbit-field" aria-hidden="true">
    <svg class="orbit-plot" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" focusable="false">
      <g ref="drift">
        <circle v-for="(ring, index) in RINGS" :key="index" class="orbit-line" :cx="ring.cx" :cy="ring.cy" :r="ring.r" path-length="1" />
      </g>
    </svg>

    <p
      v-for="(pin, index) in PINS"
      :key="pin.label"
      :ref="(el) => { if (el) pins[index] = el as HTMLElement }"
      class="orbit-pin"
      :class="`is-${sides[index]}`"
    >
      <span class="orbit-dot" />
      <span class="orbit-label">
        <span class="orbit-name">{{ pin.label }}</span>
        <span class="orbit-note">{{ pin.note }}</span>
      </span>
    </p>
  </div>
</template>
