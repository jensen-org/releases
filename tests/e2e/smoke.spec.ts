import { expect, test } from '@playwright/test'
const build = { version: 'v1.4.0', publishedAt: '2026-08-14T00:00:00Z', byteSize: 26004684, assetName: 'Jensen-arm64.dmg', downloadUrl: 'https://github.com/jensen-org/jensen-release/releases/download/v1.4.0/Jensen-arm64.dmg', releaseUrl: 'https://github.com/jensen-org/jensen-release/releases/tag/v1.4.0' }
test.beforeEach(async ({ page }) => { await page.route('**/api/release', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ status: 'available', releaseUrl: build.releaseUrl, builds: [build] }) })) })

test('release card is usable', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Jensen for macOS' })).toBeAttached()
  const link = page.getByRole('link', { name: 'Download Jensen for macOS v1.4.0' })
  await expect(link).toHaveAttribute('href', /github\.com/)
  await link.focus()
  await expect(link).toBeFocused()
  await expect(page.getByLabel('Jensen signal ring')).toBeVisible()
})

test('headline leads the page on more than one line', async ({ page }) => {
  await page.goto('/')
  const headline = page.locator('.masthead-headline')
  await expect(headline).toHaveText('The engineering ecosystem for humans and agents')
  const shape = await headline.evaluate((node) => {
    const range = document.createRange()
    range.selectNodeContents(node)
    return { lines: range.getClientRects().length, size: Number.parseFloat(getComputedStyle(node).fontSize) }
  })
  expect(shape.lines).toBeGreaterThan(1)
  expect(shape.size).toBeGreaterThan(18)
  expect(await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)).toBeLessThanOrEqual(0)
})

test('the ring settles into solid black dots and only holds still under reduced motion', async ({ page }, info) => {
  const still = info.project.name === 'reduced-motion'
  await page.emulateMedia({ reducedMotion: still ? 'reduce' : 'no-preference' })
  await page.goto('/')
  const ring = page.getByLabel('Jensen signal ring')
  await expect(ring).toBeVisible()
  await page.waitForTimeout(4200)
  const sample = () => ring.evaluate((node) => {
    const canvas = node as HTMLCanvasElement
    const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data
    let ink = 0
    let solid = 0
    let tinted = 0
    let shape = 0
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) continue
      ink += 1
      shape = (shape * 31 + i) % 2147483647
      if (pixels[i + 3] !== 255) continue
      solid += 1
      if (pixels[i] !== 14 || pixels[i + 1] !== 14 || pixels[i + 2] !== 13) tinted += 1
    }
    return { ink, solid, tinted, shape }
  })
  const first = await sample()
  expect(first.solid).toBeGreaterThan(100)
  expect(first.tinted).toBe(0)
  await page.waitForTimeout(1100)
  const second = await sample()
  expect(second.tinted).toBe(0)
  expect(Math.abs(second.ink - first.ink) / first.ink).toBeLessThan(0.06)
  if (still) expect(second.shape).toBe(first.shape)
  else expect(second.shape).not.toBe(first.shape)
})

test('the filament layer wakes on movement, sleeps again and never blocks the page', async ({ page }, info) => {
  const still = info.project.name === 'reduced-motion'
  const wired = info.project.name === 'desktop'
  await page.emulateMedia({ reducedMotion: still ? 'reduce' : 'no-preference' })
  await page.addInitScript(() => {
    const scope = window as unknown as { __draws: number; __contexts: number }
    scope.__draws = 0
    scope.__contexts = 0
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof getContext>) {
      if (String(args[0]).startsWith('webgl')) scope.__contexts += 1
      return getContext.apply(this, args)
    } as typeof getContext
    const draw = window.WebGL2RenderingContext?.prototype?.drawElements
    if (draw) {
      window.WebGL2RenderingContext.prototype.drawElements = function (this: WebGL2RenderingContext, ...args: Parameters<typeof draw>) {
        scope.__draws += 1
        return draw.apply(this, args)
      }
    }
  })
  await page.goto('/')

  const layer = page.locator('canvas.filaments')
  await expect(layer).toHaveCount(1)
  await expect(layer).toHaveCSS('pointer-events', 'none')
  expect(await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)).toBeLessThanOrEqual(0)

  const contexts = await page.evaluate(() => (window as unknown as { __contexts: number }).__contexts)
  expect(contexts).toBe(wired ? 1 : 0)
  expect(await page.evaluate(() => (window as unknown as { __draws: number }).__draws)).toBe(0)
  if (!wired) return

  await page.mouse.move(200, 300)
  await page.mouse.move(340, 430, { steps: 12 })
  await page.waitForTimeout(400)
  expect(await page.evaluate(() => (window as unknown as { __draws: number }).__draws)).toBeGreaterThan(0)

  await page.evaluate(() => window.dispatchEvent(new Event('blur')))
  await page.waitForTimeout(4000)
  const settled = await page.evaluate(() => (window as unknown as { __draws: number }).__draws)
  await page.waitForTimeout(1200)
  expect(await page.evaluate(() => (window as unknown as { __draws: number }).__draws)).toBe(settled)
})
