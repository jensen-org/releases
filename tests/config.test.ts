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

  it('emits social metadata and crawler files in the production bundle', () => {
    if (!existsSync('dist')) return
    const html = readFileSync('dist/index.html', 'utf8')
    for (const tag of ['rel="canonical"', 'og:image', 'og:url', 'twitter:card', 'apple-touch-icon']) expect(html).toContain(tag)
    for (const file of ['dist/og.png', 'dist/apple-touch-icon.png', 'dist/robots.txt', 'dist/sitemap.xml']) expect(existsSync(file)).toBe(true)
  })
})

describe('search metadata', () => {
  const built = () => (existsSync('dist/index.html') ? readFileSync('dist/index.html', 'utf8') : null)
  const content = (html: string, pattern: RegExp) => html.match(pattern)?.[1] ?? ''

  it('names the product category in the title', () => {
    const html = built()
    if (!html) return
    expect(content(html, /<title>([^<]*)<\/title>/)).toContain('AI IDE')
  })

  it('keeps the description within the length search engines display', () => {
    const html = built()
    if (!html) return
    const description = content(html, /name="description" content="([^"]*)"/)
    expect(description.length).toBeGreaterThanOrEqual(120)
    expect(description.length).toBeLessThanOrEqual(165)
    expect(content(html, /property="og:description" content="([^"]*)"/)).toBe(description)
    expect(content(html, /name="twitter:description" content="([^"]*)"/)).toBe(description)
  })

  it('never separates copy with dashes', () => {
    const html = built()
    if (!html) return
    const values = [...html.matchAll(/(?:content|alt)="([^"]*)"/g)].map((match) => match[1])
    for (const value of [...values, content(html, /<title>([^<]*)<\/title>/)]) expect(value).not.toMatch(/\s[-–—]\s|—/)
  })

  it('declares the application as structured data', () => {
    const html = built()
    if (!html) return
    const graph = JSON.parse(content(html, /<script type="application\/ld\+json">([^<]*)<\/script>/))['@graph']
    const types = graph.map((node: { '@type': string }) => node['@type'])
    expect(types).toEqual(['SoftwareApplication', 'Organization', 'WebSite'])
    const app = graph[0]
    expect(app.applicationCategory).toBe('DeveloperApplication')
    expect(app.operatingSystem).toBe('macOS, Linux')
    expect(app.offers.price).toBe('0')
    expect(app.downloadUrl).toMatch(/^https:\/\//)
  })

  it('dates the sitemap entry', () => {
    if (!existsSync('dist/sitemap.xml')) return
    expect(readFileSync('dist/sitemap.xml', 'utf8')).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/)
  })
})
