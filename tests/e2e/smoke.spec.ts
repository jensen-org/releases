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
