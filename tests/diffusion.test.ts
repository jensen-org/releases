import { describe, expect, it } from 'vitest'
import {
  DOT_ALPHA, DOT_FADE, DURATION, RING_OUT, buildField, createField, distanceFromSeeds,
  distancePasses, fbm, ramp, readSchedule, window01, type Seeds,
} from '../src/lib/diffusion'

const WIDTH = 1000
const HEIGHT = 625
const CENTRE_X = 720
const CENTRE_Y = 312
const RADIUS = 200
const STEP = 1 / 60

function ringSeeds(count = 420): Seeds {
  const points: number[] = []
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 * 7
    const radius = RADIUS * (0.6 + 0.37 * ((i % 11) / 10))
    points.push(CENTRE_X + Math.cos(angle) * radius, CENTRE_Y + Math.sin(angle) * radius)
  }
  return { points: Float32Array.from(points), centreX: CENTRE_X, centreY: CENTRE_Y, radius: RADIUS }
}

const seeded = (state: number) => () => {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0
  return state / 4294967296
}

function litFraction(field: ReturnType<typeof createField>, progress: number) {
  const pixels = new Uint8ClampedArray(field.columns * field.rows * 4)
  field.coverage(pixels, progress)
  let lit = 0
  for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 127) lit += 1
  return lit / (field.columns * field.rows)
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

describe('the noise landscape', () => {
  it('stays bounded and varies with position', () => {
    const samples = [fbm(0.3, 0.7, 4), fbm(2.1, 5.5, 4), fbm(9.4, 1.2, 4), fbm(0.3, 0.7, 90)]
    for (const value of samples) expect(Math.abs(value)).toBeLessThanOrEqual(1)
    expect(new Set(samples.map((v) => v.toFixed(6))).size).toBe(samples.length)
  })

  it('measures distance outward from the marked cells', () => {
    const marked = new Uint8Array(25)
    marked[12] = 1
    const distance = distanceFromSeeds(marked, 5, 5)
    expect(distance[12]).toBe(0)
    expect(distance[7]).toBe(1)
    expect(distance[6]).toBeCloseTo(Math.SQRT2)
    expect(distance[0]).toBeCloseTo(2 * Math.SQRT2)
  })
})

describe('building the field', () => {
  it('hands back control often enough to stay inside a frame', () => {
    const build = buildField(ringSeeds(), WIDTH, HEIGHT, seeded(13))
    let yields = 0
    let step = build.next()
    while (!step.done) {
      yields += 1
      step = build.next()
    }
    // The whole build is about twenty milliseconds. Collapsing it back into one step is
    // the stall this count exists to catch.
    expect(yields).toBeGreaterThan(12)
    expect(step.value.columns).toBeGreaterThan(0)
  })

  it('slicing the distance transform does not change what it computes', () => {
    const columns = 37
    const rows = 23
    const marked = new Uint8Array(columns * rows)
    for (const at of [0, 200, 411, 660, 838]) marked[at] = 1
    const whole = distanceFromSeeds(marked, columns, rows)
    const sliced = distancePasses(marked, columns, rows, 5)
    let step = sliced.next()
    while (!step.done) step = sliced.next()
    expect(Array.from(step.value)).toEqual(Array.from(whole))
  })
})

describe('the ink front', () => {
  it('starts at the dots and nowhere else', () => {
    const seeds = ringSeeds()
    const field = createField(seeds, WIDTH, HEIGHT, seeded(3))
    const pixels = new Uint8ClampedArray(field.columns * field.rows * 4)
    field.coverage(pixels, 0.08)
    const cellWidth = WIDTH / field.columns
    const cellHeight = HEIGHT / field.rows
    let lit = 0
    let farthest = 0
    for (let row = 0; row < field.rows; row += 1) {
      for (let column = 0; column < field.columns; column += 1) {
        if (pixels[(row * field.columns + column) * 4 + 3] < 128) continue
        lit += 1
        const x = (column + 0.5) * cellWidth
        const y = (row + 0.5) * cellHeight
        let nearest = Infinity
        for (let i = 0; i < seeds.points.length; i += 2) {
          nearest = Math.min(nearest, Math.hypot(x - seeds.points[i], y - seeds.points[i + 1]))
        }
        farthest = Math.max(farthest, nearest)
      }
    }
    expect(lit).toBeGreaterThan(0)
    expect(farthest).toBeLessThan(RADIUS * 0.7)
  })

  it('grows without ever retreating and closes exactly at the end', () => {
    const field = createField(ringSeeds(), WIDTH, HEIGHT, seeded(5))
    let previous = -1
    for (let progress = 0; progress <= 1.0001; progress += 0.05) {
      const lit = litFraction(field, Math.min(1, progress))
      expect(lit).toBeGreaterThanOrEqual(previous)
      previous = lit
    }
    expect(litFraction(field, 1)).toBe(1)
    expect(litFraction(field, 0)).toBeLessThan(0.02)
  })

  it('is not a circle: the boundary is pulled about by the noise', () => {
    const field = createField(ringSeeds(), WIDTH, HEIGHT, seeded(9))
    const pixels = new Uint8ClampedArray(field.columns * field.rows * 4)
    field.coverage(pixels, 0.55)
    const radii: number[] = []
    for (let spoke = 0; spoke < 64; spoke += 1) {
      const angle = (spoke / 64) * Math.PI * 2
      let edge = 0
      for (let step = 4; step < 700; step += 4) {
        const column = Math.floor(((CENTRE_X + Math.cos(angle) * step) / WIDTH) * field.columns)
        const row = Math.floor(((CENTRE_Y + Math.sin(angle) * step) / HEIGHT) * field.rows)
        if (column < 0 || row < 0 || column >= field.columns || row >= field.rows) break
        if (pixels[(row * field.columns + column) * 4 + 3] > 127) edge = step
      }
      if (edge > 0) radii.push(edge)
    }
    const mean = radii.reduce((a, b) => a + b, 0) / radii.length
    const spread = Math.sqrt(radii.reduce((a, b) => a + (b - mean) ** 2, 0) / radii.length)
    expect(spread / mean).toBeGreaterThan(0.1)
  })

  it('is deterministic for a given source of randomness', () => {
    const a = createField(ringSeeds(), WIDTH, HEIGHT, seeded(101))
    const b = createField(ringSeeds(), WIDTH, HEIGHT, seeded(101))
    expect(litFraction(a, 0.4)).toBe(litFraction(b, 0.4))
  })
})

describe('the dots', () => {
  const travelAt = (progress: number) => {
    const field = createField(ringSeeds(), WIDTH, HEIGHT, seeded(7))
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
    expect(moved[Math.floor(moved.length * 0.05)]).toBeGreaterThan(0.04)
  })

  it('keeps the dots local to the ring rather than sending them across the page', () => {
    const moved = travelAt(DOT_FADE[1])
    expect(moved[Math.floor(moved.length * 0.5)]).toBeGreaterThan(0.2)
    expect(moved[moved.length - 1]).toBeLessThan(2)
  })
})
