import { beforeEach, describe, expect, it, vi } from 'vitest'

const track = vi.fn()
vi.mock('@vercel/analytics', () => ({ track, inject: vi.fn() }))

const { trackDownloads } = await import('../src/lib/analytics')

describe('download tracking', () => {
  beforeEach(() => {
    track.mockClear()
    document.addEventListener('click', (event) => event.preventDefault(), { once: true })
    document.body.innerHTML = `
      <button id="tab-linux" role="tab" aria-selected="true">Linux</button>
      <a id="primary" class="cta" href="https://github.com/jensen-org/releases/releases/download/v1/Jensen_1_amd64.deb" download>Download</a>
      <a id="other" href="https://github.com/jensen-org/releases/releases">Releases</a>
      <span id="inside">x</span>
    `
  })

  it('reports the platform tab and package format of a download click', () => {
    trackDownloads(document)
    document.getElementById('primary')!.click()
    expect(track).toHaveBeenCalledWith('download', { os: 'linux', format: 'deb' })
  })

  it('ignores clicks that are not downloads', () => {
    trackDownloads(document)
    document.getElementById('other')!.click()
    document.getElementById('inside')!.click()
    expect(track).not.toHaveBeenCalled()
  })
})
