import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { releasesUrl, selectReleases } from './api/release.ts'

const siteUrl = (process.env.VITE_SITE_URL ?? (process.env.VERCEL ? 'https://www.jensen-ide.com' : 'http://localhost:5173')).replace(/\/+$/, '')
const indexable = process.env.VERCEL_ENV === 'production'
const title = 'Jensen'
const description = 'Download Jensen for macOS and Linux.'

const seo = (): Plugin => ({
  name: 'jensen-seo',
  transformIndexHtml: () => [
    { tag: 'link', attrs: { rel: 'canonical', href: `${siteUrl}/` }, injectTo: 'head' as const },
    { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }, injectTo: 'head' as const },
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' as const },
    { tag: 'meta', attrs: { property: 'og:site_name', content: 'Jensen' }, injectTo: 'head' as const },
    { tag: 'meta', attrs: { property: 'og:title', content: title }, injectTo: 'head' as const },
    { tag: 'meta', attrs: { property: 'og:description', content: description }, injectTo: 'head' as const },
    { tag: 'meta', attrs: { property: 'og:url', content: `${siteUrl}/` }, injectTo: 'head' as const },
    { tag: 'meta', attrs: { property: 'og:image', content: `${siteUrl}/og.png` }, injectTo: 'head' as const },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' }, injectTo: 'head' as const },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' }, injectTo: 'head' as const },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: title }, injectTo: 'head' as const },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' as const },
    { tag: 'meta', attrs: { name: 'twitter:title', content: title }, injectTo: 'head' as const },
    { tag: 'meta', attrs: { name: 'twitter:description', content: description }, injectTo: 'head' as const },
    { tag: 'meta', attrs: { name: 'twitter:image', content: `${siteUrl}/og.png` }, injectTo: 'head' as const },
  ],
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'robots.txt', source: indexable ? `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n' })
    this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}/</loc></url></urlset>\n` })
  },
})

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

export default defineConfig({ plugins: [vue(), seo(), releaseDev()] })
