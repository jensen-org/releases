import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const siteUrl = (process.env.VITE_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:5173')).replace(/\/+$/, '')
const indexable = process.env.VERCEL_ENV === 'production'
const title = 'Jensen for macOS'
const description = 'Download Jensen for macOS on Apple Silicon.'

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

export default defineConfig({ plugins: [vue(), seo()] })
