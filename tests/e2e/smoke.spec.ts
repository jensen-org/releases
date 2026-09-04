import { expect, test } from '@playwright/test'
const build = { platform: 'macos', format: 'dmg', arch: 'arm64', version: 'v1.4.0', publishedAt: '2026-08-14T00:00:00Z', byteSize: 26004684, assetName: 'Jensen-arm64.dmg', downloadUrl: 'https://github.com/jensen-org/releases/releases/download/v1.4.0/Jensen-arm64.dmg', releaseUrl: 'https://github.com/jensen-org/releases/releases/tag/v1.4.0' }
const linux = { ...build, platform: 'linux', format: 'deb', arch: 'x86_64', byteSize: 31447219, assetName: 'Jensen_1.4.0_amd64.deb', downloadUrl: 'https://github.com/jensen-org/releases/releases/download/v1.4.0/Jensen_1.4.0_amd64.deb' }
test.beforeEach(async ({ page }) => { await page.route('**/api/release', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ status: 'available', releaseUrl: build.releaseUrl, builds: [build, linux] }) })) })

test('release card is usable', async ({ page }) => {
  await page.goto('/?diffusion=off')
  await expect(page.getByRole('heading', { name: 'Download Jensen' })).toBeAttached()
  const link = page.getByRole('link', { name: 'Download Jensen for macOS v1.4.0' })
  await expect(link).toHaveAttribute('href', /github\.com/)
  await link.focus()
  await expect(link).toBeFocused()
  await expect(page.getByLabel('Jensen signal ring')).toBeVisible()
})

test('the platform tabs swap the offer without changing the card height', async ({ page }) => {
  await page.goto('/?diffusion=off')
  const card = page.locator('.shelf-card')
  const macos = page.getByRole('tab', { name: 'macOS' })
  const linux = page.getByRole('tab', { name: 'Linux' })
  await expect(macos).toHaveAttribute('aria-selected', 'true')
  const before = (await card.boundingBox())!.height
  await linux.click()
  await expect(linux).toHaveAttribute('aria-selected', 'true')
  await expect(macos).toHaveAttribute('aria-selected', 'false')
  await expect(page.locator('.shelf-arch')).toHaveText('x86_64')
  await expect(page.getByRole('link', { name: /Download Jensen for Linux/ })).toHaveAttribute('href', /amd64\.deb$/)
  expect((await card.boundingBox())!.height).toBe(before)
})

test('a keyboard reaches both platforms and their downloads', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'the tab key is not how a phone reaches this')
  await page.goto('/?diffusion=off')
  await page.getByRole('tab', { name: 'macOS' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Linux' })).toBeFocused()
  await expect(page.getByRole('tab', { name: 'Linux' })).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: /Download Jensen for Linux/ })).toBeFocused()
  await page.getByRole('tab', { name: 'Linux' }).focus()
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByRole('tab', { name: 'macOS' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: /Download Jensen for macOS/ })).toBeFocused()
})

test('the page fits its viewport on every width the layout claims to serve', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'the mobile project is pinned to one device width')
  for (const width of [1024, 1280, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/?diffusion=off')
    const fit = await page.evaluate(() => ({
      across: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      down: document.documentElement.scrollHeight - window.innerHeight,
      hole: (() => {
        const copy = document.querySelector('.hero-copy')!.getBoundingClientRect()
        const ring = document.querySelector('.ring')!.getBoundingClientRect()
        return ring.left - copy.right
      })(),
    }))
    expect(fit.across, `horizontal scrollbar at ${width}`).toBeLessThanOrEqual(0)
    expect(fit.down, `vertical scrollbar at ${width}`).toBeLessThanOrEqual(0)
    expect(fit.hole, `gap between the copy and the ring at ${width}`).toBeLessThan(120)
  }
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

test('the entrance motion resolves to a real curve', async ({ page }, info) => {
  test.skip(info.project.name === 'reduced-motion', 'the reduced-motion project asserts the opposite')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?diffusion=off')
  const motion = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement)
    const masthead = getComputedStyle(document.querySelector('.masthead')!)
    const learn = getComputedStyle(document.querySelector('.hero-learn')!)
    return { ease: root.getPropertyValue('--ease').trim(), animation: masthead.animationName, curve: masthead.animationTimingFunction, hover: learn.transitionDuration }
  })
  expect(motion.ease).toMatch(/^cubic-bezier/)
  expect(motion.animation).toBe('settle')
  expect(motion.curve).toMatch(/^cubic-bezier/)
  expect(motion.hover).toBe('0.42s, 0.42s, 0.42s')
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

test('reduced motion holds the orbit still', async ({ page }, info) => {
  test.skip(info.project.name !== 'reduced-motion', 'only the reduced-motion project asserts this')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?diffusion=off')
  const drift = page.locator('.orbit-plot g')
  await expect(drift).toHaveCount(1)
  const first = await drift.getAttribute('transform')
  await page.mouse.move(200, 200)
  await page.mouse.move(1100, 700)
  await page.waitForTimeout(900)
  expect(await drift.getAttribute('transform')).toBe(first)
})

test('the pillars sit on the orbit and name what the docs name', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'the pillars are hidden when the hero stacks')
  await page.goto('/?diffusion=off')
  const pins = page.locator('.orbit-pin')
  await expect(pins).toHaveCount(3)
  await expect(pins.nth(0)).toContainText('Shared map')
  await expect(pins.nth(1)).toContainText('Honest by design')
  await expect(pins.nth(2)).toContainText('Git guard')
  const inside = await pins.evaluateAll((nodes) => nodes.every((node) => {
    const box = node.getBoundingClientRect()
    return box.top >= 0 && box.left >= 0 && box.right <= window.innerWidth && box.bottom <= window.innerHeight
  }))
  expect(inside, 'every pillar label sits inside the viewport').toBe(true)
})

test('reduced motion never flips the page', async ({ page }, info) => {
  test.skip(info.project.name !== 'reduced-motion', 'only the reduced-motion project asserts this')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?diffusion=now')
  await page.waitForTimeout(6000)
  expect(await page.evaluate(() => document.documentElement.dataset.theme ?? 'light')).toBe('light')
  await expect(page.locator('.diffusion-veil')).toHaveCount(0)
})
