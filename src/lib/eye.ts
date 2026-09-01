export const MESSAGE = "Sometimes, you just have to let go... and embrace what you've become. The world has changed. The old rules no longer apply."
export const SPOKES = 82
export const POSITIONS = 12
export type Dot = { x: number; y: number; bit: 0 | 1; index: number; spoke: number; position: number }
export type ScanState = { opacity: number; visible: boolean }
export function encodeMessage(message = MESSAGE): number[] { return Array.from(new TextEncoder().encode(message)).flatMap((byte) => Array.from({ length: 8 }, (_, bit) => (byte >> (7 - bit)) & 1)) }
export function generateGeometry(width: number, height: number, bits = encodeMessage()): Dot[] { const cx = width / 2; const cy = height / 2; const dots: Dot[] = []; for (let spoke = 0; spoke < SPOKES; spoke += 1) { const angle = (spoke / SPOKES) * Math.PI * 2; const almondY = height * 0.36 * Math.pow(Math.abs(Math.sin(angle)), 0.68); for (let position = 0; position < POSITIONS; position += 1) { const t = (position + 1) / (POSITIONS + 1); const rx = width * (0.1 + 0.37 * t); const ry = height * 0.08 + (almondY - height * 0.08) * t; const index = spoke * POSITIONS + position; dots.push({ x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry, bit: (bits[index] ?? 0) as 0 | 1, index, spoke, position }) } } return dots }
export function visibleDots(dots: Dot[]): Dot[] { return dots.filter((dot) => dot.bit === 1) }
export function scanState(dot: Dot, elapsed: number, reducedMotion: boolean): ScanState { if (dot.bit === 0) return { opacity: 0, visible: false }; if (reducedMotion) return { opacity: 1, visible: true }; const phase = (elapsed * 0.00065 + dot.x * 0.002) % 1; return { opacity: 0.55 + Math.abs(phase - 0.5) * 0.9, visible: true } }
