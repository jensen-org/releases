const RISE = 9
const FALL = 2.2
const SETTLE_AFTER = 1.2
const SETTLE_LEVEL = 0.3
const SLEEP_AFTER = 6
const EPSILON = 0.002

export type PointerState = { x: number; y: number; strength: number }

export type PointerTracker = {
  readonly state: PointerState
  advance(dt: number): void
  dispose(): void
}

export function createPointerTracker(wake: () => void): PointerTracker {
  const state: PointerState = { x: 0, y: 0, strength: 0 }
  let idle = Infinity
  let present = false

  const onMove = (event: PointerEvent) => {
    state.x = event.clientX
    state.y = event.clientY
    idle = 0
    present = true
    if (state.strength === 0) wake()
  }

  const onLeave = () => { present = false }
  const onHide = () => { if (document.hidden) present = false }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onMove, { passive: true })
  window.addEventListener('pointerleave', onLeave)
  window.addEventListener('blur', onLeave)
  document.addEventListener('visibilitychange', onHide)

  function advance(dt: number) {
    idle += dt
    let target = 0
    if (present) target = idle < SETTLE_AFTER ? 1 : idle < SLEEP_AFTER ? SETTLE_LEVEL : 0
    const rate = target > state.strength ? RISE : FALL
    state.strength += (target - state.strength) * (1 - Math.exp(-rate * dt))
    if (target === 0 && state.strength < EPSILON) state.strength = 0
  }

  function dispose() {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerdown', onMove)
    window.removeEventListener('pointerleave', onLeave)
    window.removeEventListener('blur', onLeave)
    document.removeEventListener('visibilitychange', onHide)
  }

  return { state, advance, dispose }
}
