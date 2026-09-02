export const MESSAGE = "Sometimes, you just have to let go... and embrace what you've become. The world has changed. The old rules no longer apply."
export const SPOKES = 82
export const POSITIONS = 12
export const INNER_RATIO = 0.48
export const OUTER_RATIO = 0.97
export type Dot = { x: number; y: number; bit: 0 | 1; index: number; bitIndex: number; spoke: number; position: number }
export type ScanState = { opacity: number; visible: boolean }

export function encodeMessage(message = MESSAGE): number[] { return Array.from(new TextEncoder().encode(message)).flatMap((byte) => Array.from({ length: 8 }, (_, bit) => (byte >> (7 - bit)) & 1)) }

export function generateGeometry(width: number, height: number, bits = encodeMessage()): Dot[] {
  const cx = width / 2
  const cy = height / 2
  const radius = Math.min(width, height) / 2
  const inner = radius * INNER_RATIO
  const outer = radius * OUTER_RATIO
  const dots: Dot[] = []
  for (let spoke = 0; spoke < SPOKES; spoke += 1) {
    const angle = (spoke / SPOKES) * Math.PI * 2 - Math.PI / 2
    for (let position = 0; position < POSITIONS; position += 1) {
      const r = inner + ((outer - inner) * position) / (POSITIONS - 1)
      const bitIndex = position * SPOKES + spoke
      dots.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, bit: (bits[bitIndex] ?? 0) as 0 | 1, index: spoke * POSITIONS + position, bitIndex, spoke, position })
    }
  }
  return dots
}

export function visibleDots(dots: Dot[]): Dot[] { return dots.filter((dot) => dot.bit === 1) }

export function decodeMessage(dots: Dot[]): string {
  const bits = Array.from({ length: SPOKES * POSITIONS }, () => 0)
  for (const dot of dots) bits[dot.bitIndex] = dot.bit
  const bytes = Uint8Array.from({ length: bits.length / 8 }, (_, byte) => bits.slice(byte * 8, byte * 8 + 8).reduce((value, bit) => (value << 1) | bit, 0))
  return new TextDecoder().decode(bytes)
}

const BAND = 0.22

export function scanState(dot: Dot, elapsed: number, reducedMotion: boolean): ScanState {
  if (dot.bit === 0) return { opacity: 0, visible: false }
  if (reducedMotion) return { opacity: 1, visible: true }
  const sweep = dot.spoke / SPOKES - elapsed * 0.00005
  const wrapped = sweep - Math.floor(sweep)
  const distance = Math.min(wrapped, 1 - wrapped)
  const crest = Math.max(0, 1 - distance / BAND)
  return { opacity: 0.74 + 0.26 * crest, visible: true }
}

const REVEAL_SPAN = 900
const REVEAL_STAGGER = 0.55

export function revealFactor(dot: Dot, elapsed: number, reducedMotion: boolean): number {
  if (reducedMotion) return 1
  const start = (dot.position / POSITIONS) * REVEAL_STAGGER
  return Math.min(1, Math.max(0, (elapsed / REVEAL_SPAN - start) / (1 - REVEAL_STAGGER)))
}
