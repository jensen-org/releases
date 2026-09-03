export const MESSAGE = "Sometimes, you just have to let go... and embrace what you've become. The world has changed. The old rules no longer apply. Read the code, keep the context close, and let the agents carry the tedium. Ship something worth keeping. And thank you for trying Jensen."
export const SPOKES = 131
export const POSITIONS = 16
// The mark is inset in its canvas by this much. The simulation breathes and shears the lattice
// to about six percent past the outer band, which used to be clipped at the canvas edge; the
// inset is the room that overshoot needs. Every other size below is inset with it, so dividing
// the canvas box by FRAME in CSS leaves the drawn mark, its dots and its motion unchanged.
export const FRAME = 0.928
export const INNER_RATIO = 0.57 * FRAME
export const OUTER_RATIO = 0.97 * FRAME
export type Dot = { x: number; y: number; bit: 0 | 1; index: number; bitIndex: number; spoke: number; position: number; angle: number; radius: number }

export function encodeMessage(message = MESSAGE): number[] { return Array.from(new TextEncoder().encode(message)).flatMap((byte) => Array.from({ length: 8 }, (_, bit) => (byte >> (7 - bit)) & 1)) }

export function generateGeometry(width: number, height: number, bits = encodeMessage()): Dot[] {
  const cx = width / 2
  const cy = height / 2
  const ring = Math.min(width, height) / 2
  const inner = ring * INNER_RATIO
  const outer = ring * OUTER_RATIO
  const dots: Dot[] = []
  for (let spoke = 0; spoke < SPOKES; spoke += 1) {
    for (let position = 0; position < POSITIONS; position += 1) {
      const angle = bandAngle(position, spoke)
      const radius = inner + ((outer - inner) * position) / (POSITIONS - 1)
      const bitIndex = position * SPOKES + spoke
      dots.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, bit: (bits[bitIndex] ?? 0) as 0 | 1, index: spoke * POSITIONS + position, bitIndex, spoke, position, angle, radius })
    }
  }
  return dots
}

export function dotRadius(side: number): number { return Math.max(1, (side * FRAME) / 300) }

export function visibleDots(dots: Dot[]): Dot[] { return dots.filter((dot) => dot.bit === 1) }

export function decodeMessage(dots: Dot[]): string {
  const bits = Array.from({ length: SPOKES * POSITIONS }, () => 0)
  for (const dot of dots) bits[dot.bitIndex] = dot.bit
  const bytes = Uint8Array.from({ length: bits.length / 8 }, (_, byte) => bits.slice(byte * 8, byte * 8 + 8).reduce((value, bit) => (value << 1) | bit, 0))
  return new TextDecoder().decode(bytes)
}

const GRADIENTS = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1], [1, 1, 0], [0, -1, 1], [-1, 1, 0], [0, -1, -1]]

function hash(x: number, y: number, z: number): number {
  const mixed = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177)
  const spread = Math.imul(mixed ^ (mixed >>> 13), 1274126177)
  return spread ^ (spread >>> 16)
}

export const MASTER_SLOTS = 1980
export const BAND_SLOTS = [132, 132, 132, 132, 132, 132, 165, 165, 165, 180, 180, 132, 198, 198, 198, 220]
const CANYONS = 9

function shares(total: number, parts: number, key: number): number[] {
  const weights = Array.from({ length: parts }, (_, i) => 1 + ((hash(key, i, 19) >>> 8) % 1000) / 1000)
  const sum = weights.reduce((a, b) => a + b, 0)
  const out = weights.map((weight) => Math.max(1, Math.floor((total * weight) / sum)))
  let drift = total - out.reduce((a, b) => a + b, 0)
  for (let i = 0; drift > 0; i = (i + 1) % parts) { out[i] += 1; drift -= 1 }
  for (let i = 0; drift < 0; i = (i + 1) % parts) { if (out[i] > 1) { out[i] -= 1; drift += 1 } }
  return out
}

const CANYON_CENTRES = Array.from({ length: CANYONS }, (_, k) => (k + 0.35 + (((hash(k, 1, 31) >>> 8) % 1000) / 1000) * 0.3) / CANYONS)

function bandLayout(position: number): Int32Array {
  const total = BAND_SLOTS[position]
  const empty = total - SPOKES
  const map = new Int32Array(SPOKES)
  if (empty <= 0) { for (let spoke = 0; spoke < SPOKES; spoke += 1) map[spoke] = spoke; return map }
  const chosen = CANYON_CENTRES.map((_, k) => k).filter((k) => (hash(position, k, 29) >>> 8) % 10 > 2)
  const active = (chosen.length ? chosen : [0]).slice(0, empty)
  const widths = shares(empty, active.length, position * 7 + 1)
  const cut = new Uint8Array(total)
  active.forEach((canyon, i) => {
    const width = widths[i]
    const first = Math.round(CANYON_CENTRES[canyon] * total) - (width >> 1)
    for (let step = 0; step < width; step += 1) {
      const slot = ((first + step) % total + total) % total
      if (slot !== 0) cut[slot] = 1
    }
  })
  let marked = cut.reduce((count, flag) => count + flag, 0)
  for (let slot = 1; slot < total && marked < empty; slot += 1) {
    if (cut[slot] || (!cut[slot - 1] && !cut[(slot + 1) % total])) continue
    cut[slot] = 1
    marked += 1
  }
  for (let slot = 1; slot < total && marked < empty; slot += 1) {
    if (cut[slot]) continue
    cut[slot] = 1
    marked += 1
  }
  let spoke = 0
  for (let slot = 0; slot < total && spoke < SPOKES; slot += 1) if (!cut[slot]) { map[spoke] = slot; spoke += 1 }
  return map
}

const BAND_LAYOUT = BAND_SLOTS.map((_, position) => bandLayout(position))

export function bandAngle(position: number, spoke: number): number {
  return (BAND_LAYOUT[position][spoke] / BAND_SLOTS[position]) * Math.PI * 2 - Math.PI / 2
}

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
const mix = (a: number, b: number, t: number) => a + (b - a) * t

export function noise3(x: number, y: number, z: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const iz = Math.floor(z)
  const fx = x - ix
  const fy = y - iy
  const fz = z - iz
  const ux = fade(fx)
  const uy = fade(fy)
  const uz = fade(fz)
  const corner = (dx: number, dy: number, dz: number) => {
    const gradient = GRADIENTS[hash(ix + dx, iy + dy, iz + dz) & 15]
    return gradient[0] * (fx - dx) + gradient[1] * (fy - dy) + gradient[2] * (fz - dz)
  }
  const near = mix(mix(corner(0, 0, 0), corner(1, 0, 0), ux), mix(corner(0, 1, 0), corner(1, 1, 0), ux), uy)
  const far = mix(mix(corner(0, 0, 1), corner(1, 0, 1), ux), mix(corner(0, 1, 1), corner(1, 1, 1), ux), uy)
  return mix(near, far, uz) * 1.4
}

const FLOW_EPS = 0.2

export function curl2(x: number, y: number, z: number): [number, number] {
  const scale = 1 / (2 * FLOW_EPS)
  return [(noise3(x, y + FLOW_EPS, z) - noise3(x, y - FLOW_EPS, z)) * scale, (noise3(x - FLOW_EPS, y, z) - noise3(x + FLOW_EPS, y, z)) * scale]
}

const OMEGA = 3.7
const ZETA = 0.6
const SPRING = OMEGA * OMEGA
const FLOW_GAIN = 2
const FLOW_SCALE = 2.4
const FLOW_PERIOD = 7
const OCTAVE_GAIN = 0.2
const OCTAVE_PERIOD = 3
const SHEAR = 0.075
const SHEAR_KEY = 3.5
const SHEAR_PERIOD = 16
const SPIN = 0.013
const BREATH = 0.045
const BREATH_PERIOD = 11
const REVEAL_BAND = 0.62
const REVEAL_JITTER = 0.14
const REVEAL_FADE = 0.55
const CAGE_REST = 3

export function budget(side: number): number { return (side * FRAME) / 75 - 3 * dotRadius(side) }

export type RingSim = {
  readonly count: number
  readonly positions: Float64Array
  readonly alpha: Float64Array
  readonly revealed: boolean
  side: number
  elapsed: number
  step(dt: number): void
  resize(side: number): void
  maxExcursion(): number
}

export function createRingSim(side: number, dots: Dot[] = generateGeometry(side, side)): RingSim {
  const count = dots.length
  const positions = new Float64Array(count * 2)
  const velocity = new Float64Array(count * 2)
  const home = new Float64Array(count * 2)
  const angle = new Float64Array(count)
  const slot = new Float64Array(count)
  const band = new Float64Array(count)
  const dawn = new Float64Array(count)
  const alpha = new Float64Array(count)
  const shearBand = new Float64Array(POSITIONS)

  let ring = side / 2
  let centre = side / 2
  let flow = SPRING * FLOW_GAIN * budget(side)
  let motion = budget(side) / dotRadius(side)
  let cageRest = CAGE_REST * dotRadius(side)

  dots.forEach((dot, i) => {
    angle[i] = dot.angle
    slot[i] = dot.radius
    band[i] = dot.position / (POSITIONS - 1)
    dawn[i] = REVEAL_BAND * band[i] + REVEAL_JITTER * (((hash(dot.spoke, dot.position, 7) >>> 8) / 0x1000000) % 1)
  })

  function seed() {
    velocity.fill(0)
    alpha.fill(0)
    for (let i = 0; i < count; i += 1) {
      positions[i * 2] = dot(i, 0)
      positions[i * 2 + 1] = dot(i, 1)
      home[i * 2] = positions[i * 2]
      home[i * 2 + 1] = positions[i * 2 + 1]
    }
  }

  function dot(i: number, axis: number) {
    return centre + (axis === 0 ? Math.cos(angle[i]) : Math.sin(angle[i])) * slot[i]
  }

  seed()
  let elapsed = 0
  let revealed = false

  function step(dt: number) {
    elapsed += dt
    const friction = Math.exp(-2 * ZETA * OMEGA * dt)
    const breathe = 1 + BREATH * motion * noise3(11.5, 4.25, elapsed / BREATH_PERIOD)
    for (let b = 0; b < POSITIONS; b += 1) shearBand[b] = SHEAR * motion * noise3((b / (POSITIONS - 1)) * SHEAR_KEY, 2.5, elapsed / SHEAR_PERIOD)
    const spin = SPIN * motion * elapsed
    const flowTime = elapsed / FLOW_PERIOD
    const octaveTime = elapsed / OCTAVE_PERIOD
    let lit = true
    for (let i = 0; i < count; i += 1) {
      if (alpha[i] < 1) {
        alpha[i] = Math.min(1, Math.max(0, (elapsed - dawn[i]) / REVEAL_FADE))
        if (alpha[i] < 1) lit = false
      }
      const heading = angle[i] + spin + shearBand[Math.round(band[i] * (POSITIONS - 1))]
      const reach = slot[i] * breathe
      const u = (Math.cos(heading) * reach) / ring
      const v = (Math.sin(heading) * reach) / ring
      const hx = centre + u * ring
      const hy = centre + v * ring
      home[i * 2] = hx
      home[i * 2 + 1] = hy
      const [c1x, c1y] = curl2(u * FLOW_SCALE, v * FLOW_SCALE, flowTime)
      const [c2x, c2y] = curl2(u * FLOW_SCALE * 2, v * FLOW_SCALE * 2, octaveTime)
      const rawX = c1x + c2x * OCTAVE_GAIN
      const rawY = c1y + c2y * OCTAVE_GAIN
      const strength = Math.hypot(rawX, rawY)
      const eased = strength > 0 ? 1 / Math.sqrt(1 + strength * strength) : 0
      let x = positions[i * 2]
      let y = positions[i * 2 + 1]
      let vx = (velocity[i * 2] + (rawX * eased * flow + (hx - x) * SPRING) * dt) * friction
      let vy = (velocity[i * 2 + 1] + (rawY * eased * flow + (hy - y) * SPRING) * dt) * friction
      x += vx * dt
      y += vy * dt
      const ox = x - hx
      const oy = y - hy
      const reachOut = Math.hypot(ox, oy)
      const cage = cageRest
      if (reachOut > cage) {
        const nx = ox / reachOut
        const ny = oy / reachOut
        x = hx + nx * cage
        y = hy + ny * cage
        const outward = vx * nx + vy * ny
        if (outward > 0) {
          vx -= outward * nx
          vy -= outward * ny
        }
      }
      positions[i * 2] = x
      positions[i * 2 + 1] = y
      velocity[i * 2] = vx
      velocity[i * 2 + 1] = vy
    }
    revealed = lit
  }

  function resize(next: number) {
    const factor = next / side
    for (let i = 0; i < count; i += 1) {
      positions[i * 2] = centre * factor + (positions[i * 2] - centre) * factor
      positions[i * 2 + 1] = centre * factor + (positions[i * 2 + 1] - centre) * factor
      velocity[i * 2] *= factor
      velocity[i * 2 + 1] *= factor
      slot[i] *= factor
    }
    side = next
    ring = next / 2
    centre = next / 2
    flow = SPRING * FLOW_GAIN * budget(next)
    motion = budget(next) / dotRadius(next)
    cageRest = CAGE_REST * dotRadius(next)
  }

  function maxExcursion() {
    let peak = 0
    for (let i = 0; i < count; i += 1) peak = Math.max(peak, Math.hypot(positions[i * 2] - home[i * 2], positions[i * 2 + 1] - home[i * 2 + 1]))
    return peak
  }

  return {
    count,
    positions,
    alpha,
    get revealed() { return revealed },
    get side() { return side },
    set side(next: number) { resize(next) },
    get elapsed() { return elapsed },
    set elapsed(next: number) { elapsed = next },
    step,
    resize,
    maxExcursion,
  }
}
