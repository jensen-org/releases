import { describe, expect, it } from 'vitest'
import { DOT_ALPHA, DOT_FADE, DURATION, RING_OUT, createField, ramp, readSchedule, window01, type Seeds } from '../src/lib/diffusion'

const WIDTH = 1000
const HEIGHT = 625
const CENTRE_X = 720
const CENTRE_Y = 312
const RADIUS = 200

function ringSeeds(count = 260): Seeds {
  const points: number[] = []
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2
    const radius = RADIUS * (0.6 + 0.37 * ((i % 7) / 6))
    points.push(CENTRE_X + Math.cos(angle) * radius, CENTRE_Y + Math.sin(angle) * radius)
  }
  return { points: Float32Array.from(points), centreX: CENTRE_X, centreY: CENTRE_Y, radius: RADIUS }
}

const seeded = (state: number) => () => {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0
  return state / 4294967296
}

const STEP = 1 / 60

function run(random: () => number, onFrame?: (field: ReturnType<typeof createField>, progress: number) => void) {
  const field = createField(ringSeeds(), WIDTH, HEIGHT, 2, random)
  for (let elapsed = 0; elapsed < DURATION; elapsed += STEP) {
    const progress = Math.min(1, (elapsed + STEP) / DURATION)
    field.step(STEP, progress)
    onFrame?.(field, progress)
  }
  return field
}

describe('diffusion schedule', () => {
  it('runs by default, stands down on request and forces on demand', () => {
    expect(readSchedule('')).toEqual({ enabled: true, force: false })
    expect(readSchedule('?diffusion=off')).toEqual({ enabled: false, force: false })
    expect(readSchedule('?diffusion=now')).toEqual({ enabled: true, force: true })
  })

  it('ramps and windows stay inside their bounds', () => {
    expect(ramp([0, 10], 0.5, 1)).toBeCloseTo(5)
    expect(ramp([2, 4], 0, 2)).toBe(2)
    expect(ramp([2, 4], 1, 2)).toBe(4)
    expect(window01([0.2, 0.8], 0)).toBe(0)
    expect(window01([0.2, 0.8], 1)).toBe(1)
    expect(window01([0.2, 0.8], 0.5)).toBeCloseTo(0.5)
  })

  it('paints the dots at the ink the ring already draws', () => {
    expect(Math.round(255 - DOT_ALPHA * 255)).toBe(14)
  })
})

describe('diffusion transport', () => {
  const travelAt = (progress: number) => {
    const field = createField(ringSeeds(), WIDTH, HEIGHT, 2, seeded(7))
    const startX = Float32Array.from(field.dotX)
    const startY = Float32Array.from(field.dotY)
    for (let elapsed = 0; elapsed < DURATION * progress; elapsed += STEP) {
      field.step(STEP, Math.min(1, (elapsed + STEP) / DURATION))
    }
    const moved: number[] = []
    for (let i = 0; i < field.dotCount; i += 1) {
      moved.push(Math.hypot(field.dotX[i] - startX[i], field.dotY[i] - startY[i]) / RADIUS)
    }
    return moved.sort((a, b) => a - b)
  }

  it('empties every slot by the time the lattice has faded out', () => {
    const moved = travelAt(RING_OUT[1])
    expect(moved[Math.floor(moved.length * 0.05)]).toBeGreaterThan(0.06)
  })

  it('keeps the dots local to the ring rather than sending them across the page', () => {
    const moved = travelAt(DOT_FADE[1])
    expect(moved[Math.floor(moved.length * 0.5)]).toBeGreaterThan(0.3)
    expect(moved[moved.length - 1]).toBeLessThan(2)
  })

  it('reaches every part of the viewport inside the transition', () => {
    const columns = 8
    const rows = 5
    const seen = new Set<number>()
    run(seeded(11), (field) => {
      for (let i = 0; i < field.count; i += 1) {
        const cx = Math.floor((field.x[i] / WIDTH) * columns)
        const cy = Math.floor((field.y[i] / HEIGHT) * rows)
        if (cx < 0 || cy < 0 || cx >= columns || cy >= rows) continue
        seen.add(cy * columns + cx)
      }
    })
    expect(seen.size).toBe(columns * rows)
  })

  it('keeps a live population without running away', () => {
    const counts: number[] = []
    run(seeded(23), (field) => counts.push(field.count))
    expect(Math.min(...counts)).toBeGreaterThan(200)
    expect(Math.max(...counts)).toBeLessThan(60000)
  })

  it('is deterministic for a given source of randomness', () => {
    const a = run(seeded(101))
    const b = run(seeded(101))
    expect(Array.from(a.dotX)).toEqual(Array.from(b.dotX))
    expect(a.count).toBe(b.count)
  })
})
