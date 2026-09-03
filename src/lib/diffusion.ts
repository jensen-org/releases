import { curl2, noise3 } from './ring'

export const DURATION = 3.2
export const VEIL_CAP = 1000

/** Cells on the long side of the coverage field. It is drawn upscaled and smoothed,
 *  so this trades boundary detail against per-frame cost, not against sharpness. */
export const FIELD_LONG = 420

const OCTAVES = 4
const DISTANCE_POW = 0.6
const NOISE_CELL = 0.13
const NOISE_AMP = 0.30
const SOFT = 0.025
const GROWTH_POW = 1.8

export const DOT_ALPHA = 241 / 255
export const DOT_FADE = [0.4, 0.72]
export const RING_OUT = [0.03, 0.34]
export const RING_BACK = [0.74, 0.97]
const DOT_RELEASE = [0, 0.24]
const DOT_SWIRL = 0.075
const DOT_OUTWARD = [0.015, 0.06]
const DOT_CELL = 0.115
const DOT_DRIFT = 0.3
const DOT_OCTAVE = 0.55
const DOT_OCTAVE_CELL = 0.42
const ACCEL = 6
const DRAG = 0.92

export const ramp = (pair: readonly number[], progress: number, power: number) =>
  pair[0] + (pair[1] - pair[0]) * Math.pow(progress, power)

const smooth = (t: number) => {
  const u = Math.min(1, Math.max(0, t))
  return u * u * (3 - 2 * u)
}

export const window01 = (edges: readonly number[], progress: number) =>
  smooth((progress - edges[0]) / (edges[1] - edges[0]))

export function fbm(x: number, y: number, z: number): number {
  let sum = 0
  let amplitude = 1
  let frequency = 1
  let total = 0
  for (let octave = 0; octave < OCTAVES; octave += 1) {
    sum += noise3(x * frequency, y * frequency, z) * amplitude
    total += amplitude
    amplitude *= 0.5
    frequency *= 2
  }
  return sum / total
}

export type Seeds = { points: Float32Array; centreX: number; centreY: number; radius: number }

/** Every drawn dot on the ring canvas, downsampled to about one sample per dot and
 *  mapped into veil coordinates. Read from the outside so the ring owns nothing here. */
export function sampleSeeds(source: HTMLCanvasElement, rect: DOMRect, scale: number, side = 150): Seeds {
  const width = Math.max(1, Math.min(side, Math.round(rect.width)))
  const height = Math.max(1, Math.min(side, Math.round(rect.height)))
  const shrunk = document.createElement('canvas')
  shrunk.width = width
  shrunk.height = height
  const context = shrunk.getContext('2d', { willReadFrequently: true })
  const points: number[] = []
  if (context && source.width > 0 && source.height > 0) {
    context.drawImage(source, 0, 0, width, height)
    const pixels = context.getImageData(0, 0, width, height).data
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (pixels[(y * width + x) * 4 + 3] < 40) continue
        points.push((rect.left + ((x + 0.5) * rect.width) / width) * scale, (rect.top + ((y + 0.5) * rect.height) / height) * scale)
      }
    }
  }
  return {
    points: Float32Array.from(points),
    centreX: (rect.left + rect.width / 2) * scale,
    centreY: (rect.top + rect.height / 2) * scale,
    radius: (Math.min(rect.width, rect.height) / 2) * scale,
  }
}

const DIAGONAL = Math.SQRT2

/** Chamfer distance from the marked cells, two passes over the grid. */
export function distanceFromSeeds(marked: Uint8Array, columns: number, rows: number): Float32Array {
  const distance = new Float32Array(columns * rows)
  const far = columns + rows
  for (let i = 0; i < distance.length; i += 1) distance[i] = marked[i] ? 0 : far
  const relax = (at: number, from: number, cost: number) => {
    const candidate = distance[from] + cost
    if (candidate < distance[at]) distance[at] = candidate
  }
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const at = row * columns + column
      if (row > 0) relax(at, at - columns, 1)
      if (column > 0) relax(at, at - 1, 1)
      if (row > 0 && column > 0) relax(at, at - columns - 1, DIAGONAL)
      if (row > 0 && column < columns - 1) relax(at, at - columns + 1, DIAGONAL)
    }
  }
  for (let row = rows - 1; row >= 0; row -= 1) {
    for (let column = columns - 1; column >= 0; column -= 1) {
      const at = row * columns + column
      if (row < rows - 1) relax(at, at + columns, 1)
      if (column < columns - 1) relax(at, at + 1, 1)
      if (row < rows - 1 && column < columns - 1) relax(at, at + columns + 1, DIAGONAL)
      if (row < rows - 1 && column > 0) relax(at, at + columns - 1, DIAGONAL)
    }
  }
  return distance
}

export type Field = {
  readonly columns: number
  readonly rows: number
  readonly reach: number
  readonly dotCount: number
  readonly dotX: Float32Array
  readonly dotY: Float32Array
  elapsed: number
  step(dt: number, progress: number): void
  coverage(pixels: Uint8ClampedArray, progress: number): void
}

/**
 * The ink is a level set through a fixed Perlin landscape rather than a cloud of particles,
 * which is what keeps the boundary smooth at any scale. Height is the distance from the ring's
 * own dots, pulled about by fractal noise, so the front always begins at the mark and grows
 * outward in organic lobes, and the highest cell is covered exactly as the level tops out.
 */
export function createField(seeds: Seeds, width: number, height: number, random: () => number = Math.random): Field {
  const long = Math.max(width, height)
  const columns = Math.max(8, Math.round((width / long) * FIELD_LONG))
  const rows = Math.max(8, Math.round((height / long) * FIELD_LONG))

  const originX = seeds.centreX
  const originY = seeds.centreY
  let reach = 0
  for (const [cx, cy] of [[0, 0], [width, 0], [0, height], [width, height]]) reach = Math.max(reach, Math.hypot(cx - originX, cy - originY))

  const marked = new Uint8Array(columns * rows)
  for (let i = 0; i < seeds.points.length; i += 2) {
    const column = Math.floor((seeds.points[i] / width) * columns)
    const row = Math.floor((seeds.points[i + 1] / height) * rows)
    if (column < 0 || row < 0 || column >= columns || row >= rows) continue
    marked[row * columns + column] = 1
  }

  const distance = distanceFromSeeds(marked, columns, rows)
  let span = 1
  for (let i = 0; i < distance.length; i += 1) if (distance[i] > span) span = distance[i]

  const cell = Math.max(1, reach * NOISE_CELL)
  const phase = random() * 512

  // The noise is smooth, so it is evaluated on a half-scale grid and interpolated. That is
  // a quarter of the work for an identical picture, and the build happens in one frame.
  const noiseColumns = Math.ceil(columns / 2) + 1
  const noiseRows = Math.ceil(rows / 2) + 1
  const grid = new Float32Array(noiseColumns * noiseRows)
  for (let row = 0; row < noiseRows; row += 1) {
    for (let column = 0; column < noiseColumns; column += 1) {
      const x = ((column * 2 + 0.5) * width) / columns
      const y = ((row * 2 + 0.5) * height) / rows
      grid[row * noiseColumns + column] = fbm(x / cell, y / cell, phase)
    }
  }
  const sampleNoise = (column: number, row: number) => {
    const fx = column / 2
    const fy = row / 2
    const x0 = Math.min(noiseColumns - 2, Math.floor(fx))
    const y0 = Math.min(noiseRows - 2, Math.floor(fy))
    const tx = fx - x0
    const ty = fy - y0
    const top = grid[y0 * noiseColumns + x0] * (1 - tx) + grid[y0 * noiseColumns + x0 + 1] * tx
    const bottom = grid[(y0 + 1) * noiseColumns + x0] * (1 - tx) + grid[(y0 + 1) * noiseColumns + x0 + 1] * tx
    return top * (1 - ty) + bottom * ty
  }

  const heights = new Float32Array(columns * rows)
  let low = Infinity
  let high = -Infinity
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const at = row * columns + column
      // Steep near the dots and shallow far out, so noise gives the front its shape
      // without letting the whole dot band cross the level at once.
      const value = Math.pow(distance[at] / span, DISTANCE_POW) - NOISE_AMP * sampleNoise(column, row)
      heights[at] = value
      if (value < low) low = value
      if (value > high) high = value
    }
  }

  const dotCount = seeds.points.length / 2
  const dotX = new Float32Array(dotCount)
  const dotY = new Float32Array(dotCount)
  const dotVx = new Float32Array(dotCount)
  const dotVy = new Float32Array(dotCount)
  for (let i = 0; i < dotCount; i += 1) {
    dotX[i] = seeds.points[i * 2]
    dotY[i] = seeds.points[i * 2 + 1]
  }

  let elapsed = 0

  function step(dt: number, progress: number) {
    elapsed += dt
    const swirlCell = reach * DOT_CELL
    const fine = swirlCell * DOT_OCTAVE_CELL
    const release = window01(DOT_RELEASE, progress)
    const swirl = reach * DOT_SWIRL * release
    const outward = reach * ramp(DOT_OUTWARD, progress, 1) * release
    const drag = Math.pow(DRAG, dt * 60)
    for (let i = 0; i < dotCount; i += 1) {
      const x = dotX[i]
      const y = dotY[i]
      const [c1x, c1y] = curl2(x / swirlCell, y / swirlCell, elapsed * DOT_DRIFT)
      const [c2x, c2y] = curl2(x / fine, y / fine, elapsed * DOT_DRIFT * 1.7)
      let ax = x - originX
      let ay = y - originY
      const reachOut = Math.hypot(ax, ay) || 1
      ax /= reachOut
      ay /= reachOut
      dotVx[i] = (dotVx[i] + ((c1x + c2x * DOT_OCTAVE) * swirl + ax * outward) * dt * ACCEL) * drag
      dotVy[i] = (dotVy[i] + ((c1y + c2y * DOT_OCTAVE) * swirl + ay * outward) * dt * ACCEL) * drag
      dotX[i] = x + dotVx[i] * dt
      dotY[i] = y + dotVy[i] * dt
    }
  }

  function coverage(pixels: Uint8ClampedArray, progress: number) {
    const threshold = low + (high - low + SOFT) * Math.pow(progress, GROWTH_POW)
    for (let i = 0; i < heights.length; i += 1) {
      const value = (threshold - heights[i]) / SOFT
      const at = i * 4
      pixels[at] = 255
      pixels[at + 1] = 255
      pixels[at + 2] = 255
      pixels[at + 3] = value <= 0 ? 0 : value >= 1 ? 255 : Math.round(value * 255)
    }
  }

  return {
    columns,
    rows,
    reach,
    dotCount,
    dotX,
    dotY,
    get elapsed() { return elapsed },
    set elapsed(next: number) { elapsed = next },
    step,
    coverage,
  }
}

export type Schedule = { enabled: boolean; force: boolean }

export function readSchedule(search: string): Schedule {
  const mode = new URLSearchParams(search).get('diffusion')
  return { enabled: mode !== 'off', force: mode === 'now' }
}
