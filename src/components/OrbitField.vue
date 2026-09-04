<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

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

let observer: ResizeObserver | undefined

const polar = (ring: Ring, angle: number) => ({
  x: ring.cx + Math.cos(angle) * ring.r,
  y: ring.cy + Math.sin(angle) * ring.r,
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

onMounted(() => {
  place()
  observer = new ResizeObserver(() => place())
  if (host.value) observer.observe(host.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div ref="host" class="orbit-field" aria-hidden="true">
    <svg class="orbit-plot" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" focusable="false">
      <circle v-for="(ring, index) in RINGS" :key="index" class="orbit-line" :cx="ring.cx" :cy="ring.cy" :r="ring.r" path-length="1" />
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
