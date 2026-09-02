import { hasCoarsePointer, prefersReducedMotion } from './motion'

const REACH = 90
const PULL = 6
const EASE = 12
const EPSILON = 0.05

export function attachMagnet(element: HTMLElement): () => void {
  if (prefersReducedMotion() || hasCoarsePointer()) return () => {}

  let frame = 0
  let last = 0
  let x = 0
  let y = 0
  let targetX = 0
  let targetY = 0

  function step(now: number) {
    frame = 0
    const delta = Math.min(0.05, (now - last) / 1000)
    last = now
    const factor = 1 - Math.exp(-EASE * delta)
    x += (targetX - x) * factor
    y += (targetY - y) * factor
    const settled = Math.abs(targetX - x) < EPSILON && Math.abs(targetY - y) < EPSILON
    if (settled) {
      x = targetX
      y = targetY
    }
    element.style.transform = x === 0 && y === 0 ? '' : `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`
    if (!settled) frame = requestAnimationFrame(step)
  }

  function start() {
    if (frame) return
    last = performance.now()
    frame = requestAnimationFrame(step)
  }

  let centreX = 0
  let centreY = 0
  let limit = REACH

  function measure() {
    const rect = element.getBoundingClientRect()
    centreX = rect.left + rect.width / 2 - x
    centreY = rect.top + rect.height / 2 - y
    limit = REACH + Math.max(rect.width, rect.height) / 2
  }

  const onMove = (event: PointerEvent) => {
    const dx = event.clientX - centreX
    const dy = event.clientY - centreY
    const distance = Math.hypot(dx, dy)
    if (distance > limit) {
      targetX = 0
      targetY = 0
    } else {
      const strength = 1 - distance / limit
      targetX = (dx / (distance || 1)) * PULL * strength
      targetY = (dy / (distance || 1)) * PULL * strength
    }
    start()
  }

  const onLeave = () => {
    targetX = 0
    targetY = 0
    start()
  }

  measure()
  const observer = new ResizeObserver(measure)
  observer.observe(document.documentElement)
  observer.observe(element)
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerleave', onLeave)
  window.addEventListener('blur', onLeave)

  return () => {
    if (frame) cancelAnimationFrame(frame)
    observer.disconnect()
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerleave', onLeave)
    window.removeEventListener('blur', onLeave)
    element.style.transform = ''
  }
}
