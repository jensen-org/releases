import { copyFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const here = dirname(fileURLToPath(import.meta.url))
const output = resolve(here, '../public/og.png')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto(pathToFileURL(resolve(here, 'og.html')).href)
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: output, clip: { x: 0, y: 0, width: 1200, height: 630 } })
await browser.close()

copyFileSync(output, resolve(here, '../docs-site/public/og.png'))
