<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { hasCoarsePointer, prefersReducedMotion } from '../lib/motion'

const CENTRE = 50
const CONTAIN = 49
const SCALE = 58
const TICK_INNER = SCALE - 0.8
const TICK_OUTER = SCALE + 0.8
const BLEED = 95
const BLEED_ARC = 1.35
const BLEED_GAP = 0.14
const NODES = [
  { drift: 0.058, rest: -1.15, pull: 1 },
  { drift: -0.034, rest: 2.05, pull: 0.42 },
]

const host = ref<SVGSVGElement | null>(null)
const marks = ref<SVGGElement[]>([])
const ticks = ref('')

let frame = 0
let observer: ResizeObserver | undefined
let onPointer: ((event: PointerEvent) => void) | undefined
let still = false
let last = 0
let aim: number | null = null
const angles = NODES.map((node) => node.rest)

const polar = (radius: number, angle: number) => `${(CENTRE + Math.cos(angle) * radius).toFixed(3)} ${(CENTRE + Math.sin(angle) * radius).toFixed(3)}`

const arc = (radius: number, from: number, to: number) =>
  `M${polar(radius, from)}A${radius} ${radius} 0 ${to - from > Math.PI ? 1 : 0} 1 ${polar(radius, to)}`

function graduate(count: number) {
  let path = ''
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    path += `M${polar(TICK_INNER, angle)}L${polar(TICK_OUTER, angle)}`
  }
  ticks.value = path
}

function place() {
  marks.value.forEach((mark, i) => {
    if (mark) mark.setAttribute('transform', `rotate(${((angles[i] * 180) / Math.PI).toFixed(2)} ${CENTRE} ${CENTRE})`)
  })
}

function tick(now: number) {
  const step = Math.min(0.05, (now - last) / 1000)
  last = now
  NODES.forEach((node, i) => {
    const target = aim === null ? angles[i] + node.drift * step : aim + node.rest
    const delta = Math.atan2(Math.sin(target - angles[i]), Math.cos(target - angles[i]))
    angles[i] += aim === null ? node.drift * step : delta * Math.min(1, node.pull * step * 3.2)
  })
  place()
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  still = prefersReducedMotion()
  const measure = () => graduate((host.value?.clientWidth ?? 0) < 420 ? 66 : 131)
  measure()
  place()
  if (still) return
  observer = new ResizeObserver(measure)
  if (host.value) observer.observe(host.value)
  if (!hasCoarsePointer()) {
    onPointer = (event) => {
      const box = host.value?.getBoundingClientRect()
      if (!box) return
      aim = Math.atan2(event.clientY - (box.top + box.height / 2), event.clientX - (box.left + box.width / 2))
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
  }
  last = performance.now()
  frame = requestAnimationFrame(tick)
})

onUnmounted(() => {
  observer?.disconnect()
  if (frame) cancelAnimationFrame(frame)
  if (onPointer) window.removeEventListener('pointermove', onPointer)
})
</script>

<template>
  <svg ref="host" class="orbit-field" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <circle class="orbit-contain" :cx="CENTRE" :cy="CENTRE" :r="CONTAIN" />
    <circle class="orbit-scale" :cx="CENTRE" :cy="CENTRE" :r="SCALE" />
    <path class="orbit-ticks" :d="ticks" />
    <path class="orbit-bleed" :d="arc(BLEED, -BLEED_ARC, -BLEED_GAP)" />
    <path class="orbit-bleed" :d="arc(BLEED, BLEED_GAP, BLEED_ARC)" />
    <g v-for="(node, index) in NODES" :key="index" :ref="(el) => { if (el) marks[index] = el as SVGGElement }">
      <path class="orbit-leader" :d="`M${polar(CONTAIN + 0.8, 0)}L${polar(SCALE - 1.6, 0)}`" />
      <circle class="orbit-node" :cx="CENTRE + SCALE" :cy="CENTRE" r="1.15" />
    </g>
  </svg>
</template>
