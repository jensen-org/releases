import { describe, expect, it } from 'vitest'
import { BAND_SLOTS, INNER_RATIO, MASTER_SLOTS, MESSAGE, OUTER_RATIO, POSITIONS, SPOKES, bandAngle, createRingSim, curl2, decodeMessage, dotRadius, encodeMessage, generateGeometry, noise3, visibleDots, type Dot, type RingSim } from '../src/lib/ring'

const STEP = 1 / 60

function advance(sim: RingSim, seconds: number) {
  const steps = Math.round(seconds / STEP)
  for (let i = 0; i < steps; i += 1) sim.step(STEP)
}

function radialSpread(sim: RingSim, centre: number) {
  let low = Infinity
  let high = 0
  for (let i = 0; i < sim.count; i += 1) {
    const distance = Math.hypot(sim.positions[i * 2] - centre, sim.positions[i * 2 + 1] - centre)
    low = Math.min(low, distance)
    high = Math.max(high, distance)
  }
  return { low, high }
}

function closestPair(sim: RingSim, cell: number) {
  const grid = new Map<number, number[]>()
  for (let i = 0; i < sim.count; i += 1) {
    const key = ((Math.floor(sim.positions[i * 2] / cell) + 2048) << 16) | (Math.floor(sim.positions[i * 2 + 1] / cell) + 2048)
    const bucket = grid.get(key)
    if (bucket) bucket.push(i)
    else grid.set(key, [i])
  }
  let closest = Infinity
  for (const [key, bucket] of grid) {
    const gx = key >> 16
    const gy = key & 0xffff
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1], [1, -1]]) {
      const other = grid.get(((gx + dx) << 16) | (gy + dy))
      if (!other) continue
      for (const a of bucket) {
        for (const b of other) {
          if (dx === 0 && dy === 0 && b <= a) continue
          closest = Math.min(closest, Math.hypot(sim.positions[a * 2] - sim.positions[b * 2], sim.positions[a * 2 + 1] - sim.positions[b * 2 + 1]))
        }
      }
    }
  }
  return closest
}

describe('signal ring data', () => {
  it('encodes exact message', () => {
    const bits = encodeMessage()
    expect(new TextEncoder().encode(MESSAGE)).toHaveLength((SPOKES * POSITIONS) / 8)
    expect(bits).toHaveLength(SPOKES * POSITIONS)
    expect(bits.slice(0, 16)).toEqual([0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1])
  })

  it('creates clockwise 131 by 16 lattice', () => {
    const geometry = generateGeometry(680, 378)
    expect(geometry).toHaveLength(SPOKES * POSITIONS)
    expect(geometry[0]).toMatchObject({ spoke: 0, position: 0, index: 0 })
    expect(geometry[POSITIONS - 1]).toMatchObject({ spoke: 0, position: POSITIONS - 1, index: POSITIONS - 1 })
    expect(geometry[POSITIONS]).toMatchObject({ spoke: 1, position: 0, index: POSITIONS })
    expect(geometry.at(-1)?.index).toBe(SPOKES * POSITIONS - 1)
  })

  it('lays every dot on one circle with spoke zero at twelve o clock', () => {
    const geometry = generateGeometry(620, 620)
    const radii = geometry.map((dot) => Math.hypot(dot.x - 310, dot.y - 310))
    expect(Math.min(...radii)).toBeCloseTo(310 * INNER_RATIO, 6)
    expect(Math.max(...radii)).toBeCloseTo(310 * OUTER_RATIO, 6)
    expect(geometry[0]).toMatchObject({ x: 310 })
    expect(geometry[0].y).toBeLessThan(310)
    expect(geometry[POSITIONS].x).toBeGreaterThan(310)
  })

  it('carries the polar angle and radius of every slot', () => {
    const geometry = generateGeometry(620, 620)
    for (const dot of geometry.slice(0, 200)) {
      expect(310 + Math.cos(dot.angle) * dot.radius).toBeCloseTo(dot.x, 9)
      expect(310 + Math.sin(dot.angle) * dot.radius).toBeCloseTo(dot.y, 9)
    }
  })

  it('spreads the message evenly across every ring', () => {
    const geometry = generateGeometry(620, 620)
    for (let position = 0; position < POSITIONS; position += 1) {
      const lit = geometry.filter((dot) => dot.position === position && dot.bit === 1)
      expect(lit.length).toBeGreaterThan(SPOKES * 0.35)
    }
  })

  it('leaves clear air between every neighbouring slot at any size', () => {
    for (const side of [600, 480, 380, 320]) {
      const geometry = generateGeometry(side, side)
      const diameter = dotRadius(side) * 2
      let closest = Infinity
      for (let a = 0; a < geometry.length; a += 1) {
        for (let b = a + 1; b < geometry.length; b += 1) {
          closest = Math.min(closest, Math.hypot(geometry[a].x - geometry[b].x, geometry[a].y - geometry[b].y))
        }
      }
      expect(closest).toBeGreaterThan(diameter * 1.5)
    }
  })

  it('lands every dot on the shared master lattice', () => {
    for (const slots of BAND_SLOTS) expect(MASTER_SLOTS % slots).toBe(0)
    for (const dot of generateGeometry(620, 620)) {
      const step = ((dot.angle + Math.PI / 2) / (Math.PI * 2)) * MASTER_SLOTS
      expect(Math.abs(step - Math.round(step))).toBeLessThan(1e-9)
    }
    expect(bandAngle(0, 0)).toBeCloseTo(-Math.PI / 2, 12)
  })

  it('gives every ring its own slot count so the gaps widen outward', () => {
    const geometry = generateGeometry(620, 620)
    const widestGap = (position: number) => {
      const slots = geometry
        .filter((dot) => dot.position === position)
        .map((dot) => Math.round(((dot.angle + Math.PI / 2) / (Math.PI * 2)) * BAND_SLOTS[position]))
        .sort((a, b) => a - b)
      expect(slots).toHaveLength(SPOKES)
      expect(new Set(slots)).toHaveProperty('size', SPOKES)
      expect(slots[0]).toBe(0)
      return Math.max(...slots.map((slot, i) => (i ? slot - slots[i - 1] : 1)))
    }
    expect(BAND_SLOTS).toHaveLength(POSITIONS)
    expect(new Set(BAND_SLOTS).size).toBeGreaterThan(1)
    expect(widestGap(POSITIONS - 1)).toBeGreaterThan(widestGap(0) * 4)
  })

  it('round trips the hidden message back out of the geometry', () => {
    expect(decodeMessage(generateGeometry(620, 620))).toBe(MESSAGE)
  })

  it('draws only the one bits', () => {
    const dots = generateGeometry(400, 200, [1, 0, ...Array(SPOKES * POSITIONS - 2).fill(0)])
    expect(visibleDots(dots)).toHaveLength(1)
    expect(visibleDots(dots)[0]).toMatchObject({ spoke: 0, position: 0 })
  })
})

describe('signal ring noise', () => {
  it('stays smooth, bounded and finite everywhere', () => {
    let low = Infinity
    let high = -Infinity
    const walk = (spacing: number) => {
      let jump = 0
      let previous = noise3(-4, 1.5, 0)
      for (let i = 1; i <= 4000; i += 1) {
        const value = noise3(-4 + i * spacing, 1.5 + i * spacing * 0.7, i * spacing * 0.3)
        expect(Number.isFinite(value)).toBe(true)
        jump = Math.max(jump, Math.abs(value - previous))
        previous = value
        low = Math.min(low, value)
        high = Math.max(high, value)
      }
      return jump
    }
    const coarse = walk(0.02)
    const fine = walk(0.005)
    expect(fine).toBeLessThan(coarse * 0.4)
    expect(low).toBeLessThan(-0.4)
    expect(high).toBeGreaterThan(0.4)
    expect(Math.max(-low, high)).toBeLessThanOrEqual(1)
  })

  it('survives negative lattice coordinates that a signed hash would poison', () => {
    for (const point of [[-1.5, -2.5, -3.5], [-1e5, -1e5, -1e5], [-0.0001, -0.0001, -0.0001]]) {
      expect(Number.isFinite(noise3(point[0], point[1], point[2]))).toBe(true)
      expect(curl2(point[0], point[1], point[2]).every(Number.isFinite)).toBe(true)
    }
  })

  it('swirls rather than pointing downhill, so the flow has no sinks', () => {
    let strongest = 0
    let alignment = 0
    for (let i = 0; i < 240; i += 1) {
      const x = Math.sin(i) * 3
      const y = Math.cos(i * 1.7) * 3
      const [fx, fy] = curl2(x, y, 0.4)
      const gx = (noise3(x + 0.2, y, 0.4) - noise3(x - 0.2, y, 0.4)) / 0.4
      const gy = (noise3(x, y + 0.2, 0.4) - noise3(x, y - 0.2, 0.4)) / 0.4
      const flow = Math.hypot(fx, fy)
      const slope = Math.hypot(gx, gy)
      strongest = Math.max(strongest, flow)
      if (flow > 0.1 && slope > 0.1) alignment = Math.max(alignment, Math.abs(fx * gx + fy * gy) / (flow * slope))
    }
    expect(strongest).toBeGreaterThan(0.4)
    expect(alignment).toBeLessThan(1e-12)
  })
})

describe('signal ring simulation', () => {
  it('opens on the lattice and fades in from the inner ring outward', () => {
    const side = 620
    const dots = visibleDots(generateGeometry(side, side))
    const sim = createRingSim(side, dots)
    const inner = dots.findIndex((dot) => dot.position === 0)
    const outer = dots.findIndex((dot) => dot.position === POSITIONS - 1)

    advance(sim, 0.1)
    const opening = radialSpread(sim, side / 2)
    expect(opening.low).toBeGreaterThan((side / 2) * INNER_RATIO * 0.94)
    expect(opening.high).toBeLessThan((side / 2) * OUTER_RATIO * 1.06)

    advance(sim, 0.25)
    expect(sim.revealed).toBe(false)
    expect(sim.alpha[inner]).toBeGreaterThan(sim.alpha[outer])

    advance(sim, 1.6)
    expect(sim.revealed).toBe(true)
    for (let i = 0; i < sim.count; i += 1) expect(sim.alpha[i]).toBe(1)

    advance(sim, 10)
    expect(sim.revealed).toBe(true)
    expect(Math.min(...sim.alpha)).toBe(1)
  })

  it('keeps every particle alive without ever letting the lattice touch', { timeout: 30000 }, () => {
    for (const side of [620, 288]) {
      const sim = createRingSim(side)
      const radius = dotRadius(side)
      advance(sim, 4)
      let closest = Infinity
      let peak = 0
      for (let step = 0; step < 60 * 45; step += 1) {
        sim.step(STEP)
        peak = Math.max(peak, sim.maxExcursion())
        if (step % 5 === 0) closest = Math.min(closest, closestPair(sim, (26 * side) / 620))
      }
      expect(closest).toBeGreaterThan(radius * 2.85)
      expect(peak).toBeGreaterThan(radius * 1.2)
      expect(peak).toBeLessThan(radius * 3.01)
    }
  })

  it('closes the ring seamlessly across twelve o clock', () => {
    const seam = (slot: number): Dot => ({ ...generateGeometry(620, 620)[0], angle: (slot / BAND_SLOTS[0]) * Math.PI * 2 - Math.PI / 2 })
    const first = createRingSim(620, [seam(0)])
    const lapped = createRingSim(620, [seam(BAND_SLOTS[0])])
    for (let step = 0; step < 60 * 12; step += 1) {
      first.step(STEP)
      lapped.step(STEP)
    }
    expect(lapped.positions[0]).toBeCloseTo(first.positions[0], 5)
    expect(lapped.positions[1]).toBeCloseTo(first.positions[1], 5)
  })

  it('replays identically, so vitest and the browser agree', () => {
    const run = () => {
      const sim = createRingSim(440)
      advance(sim, 3)
      return Array.from(sim.positions.slice(0, 40))
    }
    expect(run()).toEqual(run())
  })

  it('rescales in place instead of replaying the entrance', () => {
    const sim = createRingSim(620)
    advance(sim, 6)
    const before = radialSpread(sim, 310)
    const elapsed = sim.elapsed
    sim.resize(310)
    const after = radialSpread(sim, 155)
    expect(sim.elapsed).toBe(elapsed)
    expect(after.low).toBeCloseTo(before.low / 2, 6)
    expect(after.high).toBeCloseTo(before.high / 2, 6)
    advance(sim, 2)
    expect(radialSpread(sim, 155).low).toBeGreaterThan(155 * INNER_RATIO * 0.9)
  })
})
