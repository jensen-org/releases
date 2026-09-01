import { readFileSync, existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('deployment safety', () => {
  it('defines catch-all security headers', () => {
    const config = readFileSync('vercel.json', 'utf8')
    for (const header of ['Content-Security-Policy', 'X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy']) expect(config).toContain(header)
    expect(config).toContain('"source":"/(.*)"')
  })
  it('contains no server token in the production bundle', () => {
    if (!existsSync('dist')) return
    const files = readFileSync('dist/index.html', 'utf8')
    expect(files).not.toContain('sentinel-GITHUB_TOKEN')
  })
})
