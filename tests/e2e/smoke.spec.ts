import { expect, test } from '@playwright/test'
const build = { version: 'v1.4.0', publishedAt: '2026-08-14T00:00:00Z', byteSize: 26004684, assetName: 'Jensen-arm64.dmg', downloadUrl: 'https://github.com/jensen-org/jensen-release/releases/download/v1.4.0/Jensen-arm64.dmg', releaseUrl: 'https://github.com/jensen-org/jensen-release/releases/tag/v1.4.0' }
test.beforeEach(async ({ page }) => { await page.route('**/api/release', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ status: 'available', releaseUrl: build.releaseUrl, builds: [build] }) })) })

test('release card is usable', async ({ page }) => {
  await page.goto('/?diffusion=off')
  await expect(page.getByRole('heading', { name: 'Jensen for macOS' })).toBeAttached()
  const link = page.getByRole('link', { name: 'Download Jensen for macOS v1.4.0' })
  await expect(link).toHaveAttribute('href', /github\.com/)
  await link.focus()
  await expect(link).toBeFocused()
  await expect(page.getByLabel('Jensen signal ring')).toBeVisible()
})

test('headline leads the page on more than one line', async ({ page }, info) => {
  await page.goto('/?diffusion=off')
  const headline = page.locator('.hero-headline')
  await expect(headline).toHaveText('An AI-first IDE for large, complex codebases')
  const shape = await headline.evaluate((node) => {
    const range = document.createRange()
    range.selectNodeContents(node)
    const tops = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)))
    const tail = document.createRange()
    tail.selectNodeContents(node.lastElementChild!)
    const tailTops = new Set([...tail.getClientRects()].map((rect) => Math.round(rect.top)))
    return { lines: tops.size, tail: tailTops.size, size: Number.parseFloat(getComputedStyle(node).fontSize) }
  })
  expect(shape.lines).toBe(2)
  expect(shape.tail).toBe(1)
  expect(shape.size).toBeGreaterThan(18)
  if (info.project.name !== 'mobile') expect(await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)).toBeLessThanOrEqual(0)
})

test('the hero puts the copy beside the ring on a wide viewport', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'the narrow projects stack the hero')
  await page.goto('/?diffusion=off')
  const copy = await page.locator('.hero-copy').boundingBox()
  const ring = await page.locator('.ring').boundingBox()
  expect(copy).not.toBeNull()
  expect(ring).not.toBeNull()
  expect(ring!.x).toBeGreaterThan(copy!.x + copy!.width - 1)
  const learn = await page.locator('.hero-learn').boundingBox()
  const sub = await page.locator('.hero-sub').boundingBox()
  expect(Math.abs(learn!.x + learn!.width - (copy!.x + copy!.width))).toBeLessThanOrEqual(1)
  expect(learn!.y).toBeGreaterThanOrEqual(sub!.y + sub!.height)
  await expect(page.locator('.baseline-legal')).toBeVisible()
})

test('the ring settles into solid black dots and only holds still under reduced motion', async ({ page }, info) => {
  const still = info.project.name === 'reduced-motion'
  await page.emulateMedia({ reducedMotion: still ? 'reduce' : 'no-preference' })
  await page.goto('/?diffusion=off')
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

test('the diffusion flips the whole page and hands the ring back', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced-motion', 'the veil never mounts when motion is reduced')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?diffusion=now')
  await expect(page.getByLabel('Jensen signal ring')).toBeVisible()
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark', undefined, { timeout: 20000 })
  await expect(page.locator('.diffusion-veil')).toHaveCount(0)
  const state = await page.evaluate(() => ({
    paper: getComputedStyle(document.body).backgroundColor,
    ink: getComputedStyle(document.querySelector('.hero-headline')!).color,
    card: getComputedStyle(document.querySelector('.shelf-card')!).backgroundColor,
    ring: getComputedStyle(document.querySelector('.signal-ring')!).filter,
    ringInk: getComputedStyle(document.querySelector('.signal-ring')!).opacity,
    themeColour: document.querySelector('meta[name="theme-color"]')!.getAttribute('content'),
  }))
  // The dark palette is the exact difference-inverse the veil hands over, so these are literals.
  expect(state.paper).toBe('rgb(4, 4, 6)')
  expect(state.ink).toBe('rgb(241, 241, 242)')
  expect(state.card).toBe('rgb(4, 4, 6)')
  expect(state.ring).toBe('invert(1)')
  expect(state.ringInk).toBe('1')
  expect(state.themeColour).toBe('#040406')
})

test('the palette lands on the download button in the same frame as the page', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced-motion', 'the veil never mounts when motion is reduced')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?diffusion=now')
  await expect(page.getByLabel('Jensen signal ring')).toBeVisible()
  const caught = page.evaluate(() => new Promise<{ background: string, color: string }>((resolve) => {
    const observer = new MutationObserver(() => {
      if (document.documentElement.dataset.theme !== 'dark') return
      observer.disconnect()
      const style = getComputedStyle(document.querySelector('.shelf-card .p-button')!)
      resolve({ background: style.backgroundColor, color: style.color })
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  }))
  const swap = await caught
  expect(swap.background).toBe('rgb(241, 241, 242)')
  expect(swap.color).toBe('rgb(4, 4, 6)')
})

test('reduced motion never flips the page', async ({ page }, info) => {
  test.skip(info.project.name !== 'reduced-motion', 'only the reduced-motion project asserts this')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?diffusion=now')
  await page.waitForTimeout(6000)
  expect(await page.evaluate(() => document.documentElement.dataset.theme ?? 'light')).toBe('light')
  await expect(page.locator('.diffusion-veil')).toHaveCount(0)
})
