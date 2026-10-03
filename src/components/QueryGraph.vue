<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { drawGraph } from '../lib/draw'
import { STILL_SECONDS, cardFrame, createGraph, type CardFrame, type Graph } from '../lib/graph'

const DOM_INTERVAL = 80
const ROWS = 5
const CHIPS = 3
const KIND_CLASS = { '-1': 'row-removed', '0': 'row-context', '1': 'row-added' } as const
const KIND_PREFIX = { '-1': '− ', '0': '  ', '1': '+ ' } as const

const root = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const stack = ref<HTMLElement | null>(null)
const question = ref<HTMLElement | null>(null)
const caret = ref<HTMLElement | null>(null)
const status = ref<HTMLElement | null>(null)
const dot = ref<HTMLElement | null>(null)
const diff = ref<HTMLElement | null>(null)
const diffFile = ref<HTMLElement | null>(null)
const diffStat = ref<HTMLElement | null>(null)
const diffNote = ref<HTMLElement | null>(null)
const chips: HTMLElement[] = []
const rows: HTMLElement[] = []

let ctx: CanvasRenderingContext2D | null = null
let graph: Graph | null = null
let still = false
let visible = true
let raf = 0
let origin = 0
let elapsed = 0
let lastDom = -Infinity
let resizeObserver: ResizeObserver | undefined
let visibilityObserver: IntersectionObserver | undefined

function setText(element: HTMLElement | null, value: string) {
  if (element && element.textContent !== value) element.textContent = value
}

function setOpacity(element: HTMLElement | null, value: number) {
  const next = String(value)
  if (element && element.style.opacity !== next) element.style.opacity = next
}

function applyCard(frame: CardFrame) {
  setText(question.value, frame.question)
  setOpacity(caret.value, frame.caret ? 1 : 0)
  setText(status.value, frame.status)
  setOpacity(dot.value, frame.done ? 1 : frame.reading ? (frame.blink ? 0.3 : 1) : 0.3)
  chips.forEach((chip, i) => {
    setText(chip, frame.fileNames[i])
    setOpacity(chip, frame.files[i] ? 1 : 0)
  })

  const lifted = frame.diffVisible ? 'translateY(0px)' : 'translateY(104px)'
  if (stack.value && stack.value.style.transform !== lifted) stack.value.style.transform = lifted
  setOpacity(stack.value, frame.visible ? 1 : 0)
  setOpacity(diff.value, frame.diffVisible ? 1 : 0)

  const patch = frame.diff
  if (!patch) return
  setText(diffFile.value, patch.file)
  setText(diffStat.value, patch.stat)
  setText(diffNote.value, patch.note)
  rows.forEach((row, i) => {
    const { kind, text } = patch.rows[i]
    setText(row, `${KIND_PREFIX[kind]}${text}`)
    row.className = `row ${KIND_CLASS[kind]}`
  })
}

function paint(t: number) {
  if (!ctx || !graph) return
  drawGraph(ctx, graph, t)
  applyCard(cardFrame(t))
}

function tick(now: number) {
  try {
    elapsed = Math.max(0, (now - origin) / 1000)
    if (ctx && graph) {
      drawGraph(ctx, graph, elapsed)
      if (now - lastDom > DOM_INTERVAL) {
        lastDom = now
        applyCard(cardFrame(elapsed))
      }
    }
  } catch (error) {
    console.warn(error)
  }
  raf = requestAnimationFrame(tick)
}

function play() {
  if (still || !visible || raf) return
  raf = requestAnimationFrame((now) => {
    origin = now - elapsed * 1000
    tick(now)
  })
}

function pause() {
  cancelAnimationFrame(raf)
  raf = 0
}

function measure() {
  const element = canvas.value
  if (!element || !root.value) return
  const size = Math.round(root.value.clientWidth)
  if (!size || graph?.size === size) return
  const ratio = window.devicePixelRatio || 1
  element.width = size * ratio
  element.height = size * ratio
  ctx = element.getContext('2d')
  ctx?.scale(ratio, ratio)
  graph = createGraph(size)
  if (still) paint(STILL_SECONDS)
}

onMounted(() => {
  still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  measure()
  resizeObserver = new ResizeObserver(measure)
  resizeObserver.observe(root.value!)
  if (still) {
    paint(STILL_SECONDS)
    return
  }
  visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) play()
    else pause()
  }, { rootMargin: '200px' })
  visibilityObserver.observe(root.value!)
  play()
})

onBeforeUnmount(() => {
  pause()
  resizeObserver?.disconnect()
  visibilityObserver?.disconnect()
})
</script>

<template>
  <div ref="root" class="figure" aria-hidden="true">
    <canvas ref="canvas" class="figure-canvas" />
    <span class="tag tag-top">PACKAGES/CORE</span>
    <span class="tag tag-right">APPS/WEB</span>
    <span class="tag tag-bottom">SERVICES/API</span>
    <span class="tag tag-left">INFRA</span>

    <div class="stage">
      <div ref="stack" class="stack">
        <div class="query">
          <span class="query-label">⌘K · ASK JENSEN</span>
          <span class="query-text"><span ref="question" /><span ref="caret" class="caret" /></span>
          <div class="chips">
            <span v-for="i in CHIPS" :key="i" :ref="(el) => { chips[i - 1] = el as HTMLElement }" class="chip" />
          </div>
          <span class="query-status"><span ref="dot" class="query-dot" /><span ref="status" /></span>
        </div>

        <div ref="diff" class="diff">
          <div class="diff-head"><span ref="diffFile" class="diff-file" /><span ref="diffStat" class="diff-stat" /></div>
          <div class="diff-body">
            <div v-for="i in ROWS" :key="i" :ref="(el) => { rows[i - 1] = el as HTMLElement }" class="row row-context" />
          </div>
          <div class="diff-foot"><span ref="diffNote" /><span class="diff-apply">Apply</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
