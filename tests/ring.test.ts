import { describe, expect, it } from 'vitest'
import { INNER_RATIO, MESSAGE, OUTER_RATIO, POSITIONS, SPOKES, decodeMessage, dotRadius, driftOffset, encodeMessage, generateGeometry, revealFactor, scanState, shimmer, visibleDots } from '../src/lib/ring'

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

  it('spreads the message evenly across every ring', () => {
    const geometry = generateGeometry(620, 620)
    for (let position = 0; position < POSITIONS; position += 1) {
      const lit = geometry.filter((dot) => dot.position === position && dot.bit === 1)
      expect(lit.length).toBeGreaterThan(SPOKES * 0.35)
    }
  })

  it('leaves clear air between every neighbouring dot at any size', () => {
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

  it('round trips the hidden message back out of the geometry', () => {
    expect(decodeMessage(generateGeometry(620, 620))).toBe(MESSAGE)
  })

  it('only renders one bits and modulates without hiding them', () => {
    const dots = generateGeometry(400, 200, [1, 0, ...Array(SPOKES * POSITIONS - 2).fill(0)])
    expect(visibleDots(dots)).toHaveLength(1)
    expect(scanState(dots[0], 100, false).visible).toBe(true)
    expect(scanState(dots[1], 100, false).visible).toBe(false)
  })

  it('reveals from the inner ring outward and settles fully lit', () => {
    const geometry = generateGeometry(620, 620)
    const inner = geometry.find((dot) => dot.position === 0)!
    const outer = geometry.find((dot) => dot.position === POSITIONS - 1)!
    expect(revealFactor(inner, 220, false)).toBeGreaterThan(revealFactor(outer, 220, false))
    expect(revealFactor(outer, 4000, false)).toBe(1)
    expect(revealFactor(outer, 0, true)).toBe(1)
  })

  it('drifts every dot without ever closing the air between neighbours', () => {
    const side = 620
    const geometry = generateGeometry(side, side)
    const radius = dotRadius(side)
    let peak = 0
    for (let elapsed = 0; elapsed <= 40000; elapsed += 250) {
      for (const dot of geometry) peak = Math.max(peak, Math.hypot(...Object.values(driftOffset(dot, elapsed, side, false))))
    }
    expect(peak).toBeGreaterThan(radius * 0.3)
    const gap = (side / 2) * (OUTER_RATIO - INNER_RATIO) / (POSITIONS - 1)
    expect(gap - peak * 2).toBeGreaterThan(radius * 2)
  })

  it('closes the drift wave seamlessly across twelve o clock', () => {
    const side = 620
    const first = generateGeometry(side, side).find((dot) => dot.spoke === 0 && dot.position === 4)!
    for (const elapsed of [0, 1500, 7000, 13000, 29000]) {
      const here = driftOffset(first, elapsed, side, false)
      const lapped = driftOffset({ ...first, spoke: SPOKES }, elapsed, side, false)
      expect(lapped.dx).toBeCloseTo(here.dx, 9)
      expect(lapped.dy).toBeCloseTo(here.dy, 9)
    }
  })

  it('holds the lattice still under reduced motion', () => {
    const geometry = generateGeometry(620, 620)
    for (const dot of geometry.slice(0, 64)) expect(driftOffset(dot, 5000, 620, true)).toEqual({ dx: 0, dy: 0 })
  })

  it('shimmers every dot without ever putting one out', () => {
    const geometry = generateGeometry(620, 620)
    let low = Infinity
    let high = 0
    for (let elapsed = 0; elapsed <= 20000; elapsed += 120) {
      for (const dot of geometry) {
        const value = shimmer(dot, elapsed, false)
        low = Math.min(low, value)
        high = Math.max(high, value)
      }
    }
    expect(low).toBeGreaterThan(0.5)
    expect(high - low).toBeGreaterThan(0.2)
    expect(shimmer(geometry[0], 5000, true)).toBe(1)
  })

  it('closes the shimmer wave seamlessly across twelve o clock', () => {
    const first = generateGeometry(620, 620).find((dot) => dot.spoke === 0 && dot.position === 4)!
    for (const elapsed of [0, 900, 6100, 15000]) {
      expect(shimmer({ ...first, spoke: SPOKES }, elapsed, false)).toBeCloseTo(shimmer(first, elapsed, false), 9)
    }
  })
})
