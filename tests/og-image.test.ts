import { readFileSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const dimensions = (file: string) => {
  const header = readFileSync(file)
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) }
}

describe('social preview image', () => {
  for (const file of ['public/og.png', 'docs-site/public/og.png']) {
    it(`${file} is 1200x630 and light enough to unfurl`, () => {
      expect(dimensions(file)).toEqual({ width: 1200, height: 630 })
      expect(statSync(file).size).toBeLessThan(300 * 1024)
    })
  }

  it('serves the same image on both sites', () => {
    expect(readFileSync('docs-site/public/og.png').equals(readFileSync('public/og.png'))).toBe(true)
  })
})
