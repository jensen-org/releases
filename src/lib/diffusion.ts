import { curl2, noise3 } from './ring'

export const DURATION = 3.2
export const VEIL_CAP = 1000
const REF_REACH = 900

const REACH_OVER = 1.28
const FRONT_POW = 1.9
const LOBE_LOW = 0.42
const LOBE_HIGH = 1.3
const LOBE_SCALE = 2.2
const LOBE_PERIOD = 9
const LOBE_POW = 1.5
const LOBE_CLOSE = [0.66, 1]
const BINS = 256

const RECRUIT = [700, 34000]
const RECRUIT_POW = 1.5
const BAND_INNER = 0.62
const BAND_OPEN = [0.62, 1]

const LIFE = 0.95
const SWIRL = 0.15
const OUTWARD = [0.01, 0.075]
const OUTWARD_POW = 1.2
const ACCEL = 6
const DRAG = 0.92
const FIELD_CELL = 0.115
const FIELD_DRIFT = 0.3
const OCTAVE_GAIN = 0.55
const OCTAVE_CELL = 0.42
const BRANCH_RATE = 1
const BRANCH_SPREAD = 0.6
const MAX_PARTICLES = 90000

export const MARK_ALPHA = [0.05, 0.3]
export const MARK_ALPHA_POW = 0.7
export const MARK_RADIUS = [0.5, 4.5]
export const MARK_RADIUS_POW = 2
/** How far the ink bleeds each frame, in veil pixels, and how much of it moves. */
export const SPREAD = [1, 2]
export const SPREAD_POW = 2
export const SIDE_WEIGHT = 0.07
export const GAIN_RATE = [0, 14]
export const GAIN_POW = 3

/** White that composites to exactly #0e0e0d over paper, and to #f1f1f2 once the
 *  veil beneath has saturated, so the drifting dots match the ring in either state. */
export const DOT_ALPHA = 241 / 255
export const DOT_FADE = [0.34, 0.62]
export const RING_OUT = [0.03, 0.34]
export const RING_BACK = [0.74, 0.97]
const DOT_RELEASE = [0, 0.24]
const DOT_SWIRL = 0.075
const DOT_OUTWARD = [0.015, 0.06]

export const ramp = (pair: readonly number[], progress: number, power: number) =>
  pair[0] + (pair[1] - pair[0]) * Math.pow(progress, power)

const smooth = (t: number) => {
  const u = Math.min(1, Math.max(0, t))
  return u * u * (3 - 2 * u)
}

export const window01 = (edges: readonly number[], progress: number) =>
  smooth((progress - edges[0]) / (edges[1] - edges[0]))

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

export type Field = {
  readonly count: number
  readonly x: Float32Array
  readonly y: Float32Array
  readonly dotCount: number
  readonly dotX: Float32Array
  readonly dotY: Float32Array
  readonly reach: number
  elapsed: number
  step(dt: number, progress: number): void
}

export function createField(seeds: Seeds, width: number, height: number, perSeed = 2, random: () => number = Math.random): Field {
  const x = new Float32Array(MAX_PARTICLES)
  const y = new Float32Array(MAX_PARTICLES)
  const vx = new Float32Array(MAX_PARTICLES)
  const vy = new Float32Array(MAX_PARTICLES)
  const age = new Float32Array(MAX_PARTICLES)
  const life = new Float32Array(MAX_PARTICLES)
  const front = new Float32Array(BINS)

  const originX = seeds.centreX
  const originY = seeds.centreY
  let reach = 0
  for (const [cx, cy] of [[0, 0], [width, 0], [0, height], [width, height]]) reach = Math.max(reach, Math.hypot(cx - originX, cy - originY))
  const unit = reach / REF_REACH

  let count = 0
  let elapsed = 0

  function spawn(px: number, py: number, pvx: number, pvy: number, span: number) {
    if (count >= MAX_PARTICLES) return
    x[count] = px
    y[count] = py
    vx[count] = pvx
    vy[count] = pvy
    age[count] = 0
    life[count] = span
    count += 1
  }

  // The dots themselves are a second, non-accumulating set: they carry the ring's own ink
  // out of the lattice so the mark is seen to liquefy rather than to sit under the ink.
  const dotCount = seeds.points.length / 2
  const dotX = Float32Array.from(seeds.points.filter((_, i) => i % 2 === 0))
  const dotY = Float32Array.from(seeds.points.filter((_, i) => i % 2 === 1))
  const dotVx = new Float32Array(dotCount)
  const dotVy = new Float32Array(dotCount)

  front.fill(seeds.radius)
  for (let i = 0; i < seeds.points.length; i += 2) {
    for (let k = 0; k < perSeed; k += 1) {
      spawn(seeds.points[i] + (random() - 0.5) * 2, seeds.points[i + 1] + (random() - 0.5) * 2, 0, 0, LIFE * (0.7 + random() * 0.6))
    }
  }

  function lobe(bin: number, time: number): number {
    const angle = (bin / BINS) * Math.PI * 2
    const raw = 0.5 + 0.5 * noise3(Math.cos(angle) * LOBE_SCALE, Math.sin(angle) * LOBE_SCALE, time / LOBE_PERIOD)
    return LOBE_LOW + (LOBE_HIGH - LOBE_LOW) * Math.pow(Math.min(1, Math.max(0, raw)), LOBE_POW)
  }

  function step(dt: number, progress: number) {
    elapsed += dt
    const cell = reach * FIELD_CELL
    const fine = cell * OCTAVE_CELL
    const swirl = reach * SWIRL
    const outward = reach * ramp(OUTWARD, progress, OUTWARD_POW)
    const drag = Math.pow(DRAG, dt * 60)

    // The front is a direct function of progress, shaped per angle by a slow lobe that
    // converges on the full reach at the close, so every direction arrives together.
    const span = (reach * REACH_OVER - seeds.radius) * Math.pow(progress, FRONT_POW)
    const even = window01(LOBE_CLOSE, progress)
    for (let b = 0; b < BINS; b += 1) {
      const shape = lobe(b, elapsed)
      front[b] = seeds.radius + span * (shape + (1 - shape) * even)
    }

    // The dots are held near their slots at first so the mark is seen to soften before it goes.
    const release = window01(DOT_RELEASE, progress)
    const dotSwirl = reach * DOT_SWIRL * release
    const dotOut = reach * ramp(DOT_OUTWARD, progress, 1) * release
    for (let d = 0; d < dotCount; d += 1) {
      const px = dotX[d]
      const py = dotY[d]
      const [fx, fy] = curl2(px / cell, py / cell, elapsed * FIELD_DRIFT)
      const [gx, gy] = curl2(px / fine, py / fine, elapsed * FIELD_DRIFT * 1.7)
      let ax = px - originX
      let ay = py - originY
      const span2 = Math.hypot(ax, ay) || 1
      ax /= span2
      ay /= span2
      dotVx[d] = (dotVx[d] + ((fx + gx * OCTAVE_GAIN) * dotSwirl + ax * dotOut) * dt * ACCEL) * drag
      dotVy[d] = (dotVy[d] + ((fy + gy * OCTAVE_GAIN) * dotSwirl + ay * dotOut) * dt * ACCEL) * drag
      dotX[d] = px + dotVx[d] * dt
      dotY[d] = py + dotVy[d] * dt
    }

    let i = 0
    while (i < count) {
      age[i] += dt
      if (age[i] >= life[i]) {
        count -= 1
        x[i] = x[count]
        y[i] = y[count]
        vx[i] = vx[count]
        vy[i] = vy[count]
        age[i] = age[count]
        life[i] = life[count]
        continue
      }
      const px = x[i]
      const py = y[i]
      const [c1x, c1y] = curl2(px / cell, py / cell, elapsed * FIELD_DRIFT)
      const [c2x, c2y] = curl2(px / fine, py / fine, elapsed * FIELD_DRIFT * 1.7)
      const flowX = c1x + c2x * OCTAVE_GAIN
      const flowY = c1y + c2y * OCTAVE_GAIN
      let dx = px - originX
      let dy = py - originY
      const distance = Math.hypot(dx, dy) || 1
      dx /= distance
      dy /= distance
      const nextVx = (vx[i] + (flowX * swirl + dx * outward) * dt * ACCEL) * drag
      const nextVy = (vy[i] + (flowY * swirl + dy * outward) * dt * ACCEL) * drag
      x[i] = px + nextVx * dt
      y[i] = py + nextVy * dt
      vx[i] = nextVx
      vy[i] = nextVy
      if (random() < BRANCH_RATE * dt && count < MAX_PARTICLES) {
        const heading = Math.atan2(nextVy, nextVx) + (random() < 0.5 ? -1 : 1) * BRANCH_SPREAD * (0.5 + random())
        const speed = Math.hypot(nextVx, nextVy)
        spawn(px, py, Math.cos(heading) * speed, Math.sin(heading) * speed, life[i] - age[i])
      }
      i += 1
    }

    // Recruiting just behind the front is what advances it; pure advection cannot cross
    // the viewport in the time available. The band widens to the whole disc at the close
    // so the voids the flow leaves behind get filled.
    const inner = BAND_INNER * (1 - window01(BAND_OPEN, progress))
    let budget = ramp(RECRUIT, progress, RECRUIT_POW) * dt * unit * unit
    while (budget > 0) {
      if (random() > Math.min(1, budget)) break
      budget -= 1
      if (count >= MAX_PARTICLES) break
      const bin = (random() * BINS) | 0
      const angle = ((bin + random()) / BINS) * Math.PI * 2
      const radius = front[bin] * (inner + (1 - inner) * random())
      const px = originX + Math.cos(angle) * radius
      const py = originY + Math.sin(angle) * radius
      if (px < -40 || py < -40 || px > width + 40 || py > height + 40) continue
      spawn(px, py, 0, 0, LIFE * (0.5 + random() * 0.8))
    }
  }

  return {
    get count() { return count },
    x,
    y,
    dotCount,
    dotX,
    dotY,
    reach,
    get elapsed() { return elapsed },
    set elapsed(next: number) { elapsed = next },
    step,
  }
}

export type Schedule = { enabled: boolean; force: boolean }

export function readSchedule(search: string): Schedule {
  const mode = new URLSearchParams(search).get('diffusion')
  return { enabled: mode !== 'off', force: mode === 'now' }
}
