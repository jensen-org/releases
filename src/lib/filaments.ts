import { SPOKES } from './ring'

export const FILAMENTS = 74
export const SEGMENTS = 52
export const FLOATS_PER_VERTEX = 7

export type FilamentMesh = {
  readonly vertices: Float32Array
  readonly indices: Uint16Array
  readonly vertexCount: number
  readonly indexCount: number
}

function hash(x: number, y: number): number {
  const mixed = Math.imul(x, 374761393) ^ Math.imul(y, 668265263)
  const spread = Math.imul(mixed ^ (mixed >>> 13), 1274126177)
  return (spread ^ (spread >>> 16)) >>> 0
}

const unit = (x: number, y: number) => hash(x, y) / 0x100000000

export function anchorAngle(filament: number): number {
  const spoke = Math.round((filament * SPOKES) / FILAMENTS) % SPOKES
  return (spoke / SPOKES) * Math.PI * 2 - Math.PI / 2
}

export function buildFilamentMesh(): FilamentMesh {
  const vertexCount = FILAMENTS * SEGMENTS * 2
  const indexCount = FILAMENTS * (SEGMENTS - 1) * 6
  const vertices = new Float32Array(vertexCount * FLOATS_PER_VERTEX)
  const indices = new Uint16Array(indexCount)
  let vertex = 0
  let index = 0

  for (let filament = 0; filament < FILAMENTS; filament += 1) {
    const angle = anchorAngle(filament)
    const phase = unit(filament, 17)
    const reach = 0.9 + unit(filament, 41) * 0.7
    const sway = 0.55 + unit(filament, 73) * 0.95
    const curve = (unit(filament, 137) - 0.5) * 1.8
    for (let segment = 0; segment < SEGMENTS; segment += 1) {
      const t = segment / (SEGMENTS - 1)
      for (const side of [-1, 1]) {
        const offset = vertex * FLOATS_PER_VERTEX
        vertices[offset] = angle
        vertices[offset + 1] = t
        vertices[offset + 2] = side
        vertices[offset + 3] = phase
        vertices[offset + 4] = reach
        vertices[offset + 5] = sway
        vertices[offset + 6] = curve
        vertex += 1
      }
      if (segment === SEGMENTS - 1) continue
      const base = (filament * SEGMENTS + segment) * 2
      indices[index] = base
      indices[index + 1] = base + 1
      indices[index + 2] = base + 2
      indices[index + 3] = base + 2
      indices[index + 4] = base + 1
      indices[index + 5] = base + 3
      index += 6
    }
  }

  return { vertices, indices, vertexCount, indexCount }
}
