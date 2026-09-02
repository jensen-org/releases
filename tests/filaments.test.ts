import { describe, expect, it } from 'vitest'
import { SPOKES } from '../src/lib/ring'
import { FILAMENTS, FLOATS_PER_VERTEX, SEGMENTS, anchorAngle, buildFilamentMesh } from '../src/lib/filaments'

const mesh = buildFilamentMesh()

describe('filament mesh', () => {
  it('fills a ribbon of two vertices per segment for every filament', () => {
    expect(mesh.vertexCount).toBe(FILAMENTS * SEGMENTS * 2)
    expect(mesh.indexCount).toBe(FILAMENTS * (SEGMENTS - 1) * 6)
    expect(mesh.vertices).toHaveLength(mesh.vertexCount * FLOATS_PER_VERTEX)
    expect(mesh.indices).toHaveLength(mesh.indexCount)
  })

  it('keeps every index inside the buffer so a single draw call is safe', () => {
    expect(Math.max(...mesh.indices)).toBe(mesh.vertexCount - 1)
    expect(Math.min(...mesh.indices)).toBe(0)
  })

  it('walks each filament from the core to the tip with paired sides', () => {
    for (let vertex = 0; vertex < mesh.vertexCount; vertex += 2) {
      const left = vertex * FLOATS_PER_VERTEX
      const right = left + FLOATS_PER_VERTEX
      const segment = (vertex / 2) % SEGMENTS
      expect(mesh.vertices[left + 1]).toBeCloseTo(segment / (SEGMENTS - 1), 6)
      expect(mesh.vertices[left + 1]).toBe(mesh.vertices[right + 1])
      expect(mesh.vertices[left + 2]).toBe(-1)
      expect(mesh.vertices[right + 2]).toBe(1)
    }
  })

  it('anchors on the spoke lattice with spoke zero at twelve o clock', () => {
    expect(anchorAngle(0)).toBeCloseTo(-Math.PI / 2, 12)
    for (let filament = 0; filament < FILAMENTS; filament += 1) {
      const spoke = Math.round((anchorAngle(filament) + Math.PI / 2) / (Math.PI * 2) * SPOKES)
      expect(spoke).toBeGreaterThanOrEqual(0)
      expect(spoke).toBeLessThan(SPOKES)
    }
  })

  it('gives every filament its own phase, reach and sway inside sane bounds', () => {
    const phases = new Set<number>()
    for (let filament = 0; filament < FILAMENTS; filament += 1) {
      const offset = filament * SEGMENTS * 2 * FLOATS_PER_VERTEX
      const phase = mesh.vertices[offset + 3]
      const reach = mesh.vertices[offset + 4]
      const sway = mesh.vertices[offset + 5]
      const curve = mesh.vertices[offset + 6]
      phases.add(phase)
      expect(phase).toBeGreaterThanOrEqual(0)
      expect(phase).toBeLessThan(1)
      expect(reach).toBeGreaterThan(0.89)
      expect(reach).toBeLessThan(1.61)
      expect(sway).toBeGreaterThan(0.5)
      expect(sway).toBeLessThan(1.51)
      expect(Math.abs(curve)).toBeLessThan(0.91)
    }
    expect(phases.size).toBe(FILAMENTS)
  })

  it('replays identically, so the buffer can be built once and trusted', () => {
    expect(Array.from(buildFilamentMesh().vertices)).toEqual(Array.from(mesh.vertices))
  })
})
