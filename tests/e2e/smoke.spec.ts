import { expect, test } from '@playwright/test'

const build = { platform: 'macos', format: 'dmg', arch: 'arm64', version: 'v1.4.0', publishedAt: '2026-08-14T00:00:00Z', byteSize: 26004684, assetName: 'Jensen-arm64.dmg', downloadUrl: 'https://github.com/jensen-org/releases/releases/download/v1.4.0/Jensen-arm64.dmg', releaseUrl: 'https://github.com/jensen-org/releases/releases/tag/v1.4.0' }
const linux = { ...build, platform: 'linux', format: 'deb', arch: 'x86_64', byteSize: 31447219, assetName: 'Jensen_1.4.0_amd64.deb', downloadUrl: 'https://github.com/jensen-org/releases/releases/download/v1.4.0/Jensen_1.4.0_amd64.deb' }

test.beforeEach(async ({ page }) => {
  await page.route('**/api/release', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ status: 'available', releaseUrl: build.releaseUrl, builds: [build, linux] }) }))
})

test('release card is usable', async ({ page }) => {
  await page.goto('/')
  const link = page.getByRole('link', { name: 'Download Jensen for macOS v1.4.0' })
  await expect(link).toHaveAttribute('href', /github\.com/)
  await link.focus()
  await expect(link).toBeFocused()
  await expect(page.locator('.pill')).toHaveText('Public beta · v1.4.0')
})

test('the platform tabs swap the offer without changing the card height', async ({ page }) => {
  await page.goto('/')
  const card = page.locator('.shelf')
  const macos = page.getByRole('tab', { name: 'macOS' })
  const linuxTab = page.getByRole('tab', { name: 'Linux' })
  await expect(macos).toHaveAttribute('aria-selected', 'true')
  const before = (await card.boundingBox())!.height
  await linuxTab.click()
  await expect(linuxTab).toHaveAttribute('aria-selected', 'true')
  await expect(macos).toHaveAttribute('aria-selected', 'false')
  await expect(page.locator('.shelf-arch')).toHaveText('x86_64')
  await expect(page.getByRole('link', { name: /Download Jensen for Linux/ })).toHaveAttribute('href', /amd64\.deb$/)
  expect((await card.boundingBox())!.height).toBe(before)
})

test('a keyboard reaches both platforms and their downloads', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'the tab key is not how a phone reaches this')
  await page.goto('/')
  await page.getByRole('tab', { name: 'macOS' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Linux' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: /Download Jensen for Linux/ })).toBeFocused()
  await page.getByRole('tab', { name: 'Linux' }).focus()
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByRole('tab', { name: 'macOS' })).toBeFocused()
})

test('the page never scrolls sideways and the hero fits a laptop screen', async ({ page }, info) => {
  const sizes = info.project.name === 'mobile' ? [[390, 844]] : [[1024, 768], [1280, 800], [1440, 900], [1920, 1080]]
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    const across = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(across, `horizontal scroll at ${width}`).toBeLessThanOrEqual(0)
  }
  if (info.project.name !== 'mobile') {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    expect(await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)).toBeLessThanOrEqual(0)
  }
})

test('the copy sits beside the graph on a wide screen and above it on a narrow one', async ({ page }, info) => {
  await page.goto('/')
  const copy = (await page.locator('.hero-copy').boundingBox())!
  const figure = (await page.locator('.figure').boundingBox())!
  if (info.project.name === 'desktop') expect(figure.x).toBeGreaterThan(copy.x + copy.width - 1)
  if (info.project.name === 'mobile') expect(figure.y).toBeGreaterThanOrEqual(copy.y + copy.height)
  expect(figure.width).toBeCloseTo(figure.height, 0)
})

test('the header and footer lead to the documentation, with no demo', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', 'https://jensen-org.github.io/releases/')
  await expect(page.getByRole('link', { name: /Learn more/ })).toHaveAttribute('href', 'https://jensen-org.github.io/releases/')
  await expect(page.getByText(/demo/i)).toHaveCount(0)
  await expect(page.locator('video')).toHaveCount(0)
})

test('the graph draws and the card plays the first question', async ({ page }, info) => {
  const still = info.project.name === 'reduced-motion'
  await page.emulateMedia({ reducedMotion: still ? 'reduce' : 'no-preference' })
  await page.goto('/')
  await expect(page.locator('.figure')).toHaveAttribute('aria-hidden', 'true')
  const ink = () => page.locator('.figure-canvas').evaluate((node) => {
    const canvas = node as HTMLCanvasElement
    const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data
    let count = 0
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 0) count += 1
    return count
  })
  await expect.poll(ink).toBeGreaterThan(500)
  if (still) {
    await expect(page.locator('.diff-file')).toHaveText('payments/retry.ts')
    await expect(page.locator('.query-text')).toHaveText('Why does checkout retry twice?')
  } else {
    await expect(page.locator('.query-text')).toHaveText('Who owns the billing webhooks?', { timeout: 6000 })
    await expect(page.locator('.query-status')).toHaveText('5 files · 2 services · 0.1s', { timeout: 8000 })
    await expect(page.locator('.query')).toHaveClass(/query-minimal/)
    await expect(page.locator('.chip').first()).toBeHidden()
  }
})

test('reduced motion holds the figure still', async ({ page }, info) => {
  test.skip(info.project.name !== 'reduced-motion', 'only the reduced-motion project asserts this')
  await page.goto('/')
  await expect(page.locator('.diff-file')).toHaveText('payments/retry.ts')
  const read = () => page.locator('.query-status').textContent()
  const first = await read()
  await page.waitForTimeout(1500)
  expect(await read()).toBe(first)
})
