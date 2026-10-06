import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('prerendered landing page', () => {
  it('ships the headline and download area in the static HTML', () => {
    if (!existsSync('dist/index.html')) return
    const html = readFileSync('dist/index.html', 'utf8')
    expect(html).not.toContain('<div id="app"></div>')
    expect(html).toContain('An AI-first IDE for large, complex codebases')
    expect(html).toContain('Download for macOS')
    expect(html).toContain('role="tablist"')
  })
})
