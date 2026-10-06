import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createServer, defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { releasesUrl, selectReleases } from './api/release.ts'

const siteUrl = (process.env.VITE_SITE_URL ?? (process.env.VERCEL ? 'https://www.jensen-ide.com' : 'http://localhost:5173')).replace(/\/+$/, '')
const indexable = process.env.VERCEL_ENV === 'production'
const title = 'Jensen, the free AI IDE for large codebases'
const description = 'Jensen is a free AI IDE for large, complex codebases. Bring your own model: OpenAI, Anthropic, Gemini or any compatible one. macOS and Linux, Windows coming.'
const releasesPage = 'https://github.com/jensen-org/releases/releases'
const repoPage = 'https://github.com/jensen-org/releases'

const structuredData = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': `${siteUrl}/#app`,
      name: 'Jensen',
      description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'macOS, Linux',
      downloadUrl: releasesPage,
      url: `${siteUrl}/`,
      image: `${siteUrl}/og.png`,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': `${siteUrl}/#org` },
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#org`,
      name: 'Jensen',
      url: `${siteUrl}/`,
      logo: `${siteUrl}/jensen.png`,
      sameAs: [repoPage],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#site`,
      name: 'Jensen',
      url: `${siteUrl}/`,
      description,
    },
  ],
})

const head = (tag: string, attrs: Record<string, string>, children?: string) => ({ tag, attrs, children, injectTo: 'head' as const })
const meta = (key: 'name' | 'property', name: string, content: string) => head('meta', { [key]: name, content })

const seo = (): Plugin => ({
  name: 'jensen-seo',
  transformIndexHtml: () => [
    head('title', {}, title),
    meta('name', 'description', description),
    ...(indexable ? [] : [meta('name', 'robots', 'noindex, nofollow')]),
    head('link', { rel: 'canonical', href: `${siteUrl}/` }),
    head('link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }),
    head('link', { rel: 'preload', href: '/fonts/geist.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', 'Jensen'),
    meta('property', 'og:title', title),
    meta('property', 'og:description', description),
    meta('property', 'og:url', `${siteUrl}/`),
    meta('property', 'og:image', `${siteUrl}/og.png`),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', description),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', `${siteUrl}/og.png`),
    meta('name', 'twitter:image:alt', description),
    head('script', { type: 'application/ld+json' }, JSON.stringify(structuredData())),
  ],
  generateBundle() {
    const lastmod = new Date().toISOString().slice(0, 10)
    this.emitFile({ type: 'asset', fileName: 'robots.txt', source: indexable ? `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n' })
    this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}/</loc><lastmod>${lastmod}</lastmod></url></urlset>\n` })
  },
})

const prerender = (): Plugin => {
  let outDir = 'dist'
  return {
    name: 'jensen-prerender',
    apply: 'build',
    configResolved(config) { outDir = resolve(config.root, config.build.outDir) },
    async closeBundle() {
      const server = await createServer({ configFile: false, plugins: [vue()], appType: 'custom', server: { middlewareMode: true }, logLevel: 'silent' })
      try {
        const { render } = await server.ssrLoadModule('/src/entry-server.ts')
        const page = resolve(outDir, 'index.html')
        const html = readFileSync(page, 'utf8')
        const markup: string = await render()
        if (!html.includes('<div id="app"></div>')) throw new Error('prerender target <div id="app"></div> not found')
        writeFileSync(page, html.replace('<div id="app"></div>', `<div id="app">${markup}</div>`))
      } finally {
        await server.close()
      }
    },
  }
}

const releaseDev = (): Plugin => ({
  name: 'jensen-release-dev',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/api/release', async (_request, response) => {
      let payload: unknown = null
      try {
        if (process.env.VITE_RELEASE_LIVE === '1') {
          const upstream = await fetch(`https://api.github.com/repos/jensen-org/releases/releases?per_page=100`, { headers: { Accept: 'application/vnd.github+json' } })
          payload = upstream.ok ? await upstream.json() : null
        } else {
          payload = JSON.parse(readFileSync('tests/fixtures/releases.json', 'utf8'))
        }
      } catch { payload = null }
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify(payload === null ? { status: 'error', code: 'UPSTREAM_UNAVAILABLE', releaseUrl: releasesUrl } : selectReleases(payload)))
    })
  },
})

export default defineConfig({ plugins: [vue(), seo(), prerender(), releaseDev()] })
