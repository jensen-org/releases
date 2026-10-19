import { copyFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { createServer } from 'vite'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const output = resolve(root, 'public/og.png')

const server = await createServer({ configFile: false, root, logLevel: 'error', server: { port: 0 } })
await server.listen()
const origin = server.resolvedUrls?.local[0]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto(`${origin}scripts/og.html`)
await page.waitForFunction(() => (window as unknown as { ogReady?: boolean }).ogReady === true)
await page.screenshot({ path: output, clip: { x: 0, y: 0, width: 1200, height: 630 } })
await browser.close()
await server.close()

copyFileSync(output, resolve(root, 'docs-site/public/og.png'))
