import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.vue'

vi.mock('../src/components/QueryGraph.vue', () => ({ default: { render: () => h('div', { class: 'figure' }) } }))

const response = (body: unknown) => Promise.resolve({ json: () => Promise.resolve(body) })

const mac = (version: string, byteSize: number) => ({ platform: 'macos', format: 'dmg', arch: 'arm64', version, publishedAt: '2026-08-14T00:00:00Z', assetName: `Jensen-${version}-arm64.dmg`, byteSize, downloadUrl: `https://github.com/jensen-org/releases/releases/download/${version}/Jensen-arm64.dmg`, releaseUrl: 'https://github.com/r' })
const deb = (version: string, byteSize: number) => ({ platform: 'linux', format: 'deb', arch: 'x86_64', version, publishedAt: '2026-08-14T00:00:00Z', assetName: `Jensen_${version}_amd64.deb`, byteSize, downloadUrl: `https://github.com/jensen-org/releases/releases/download/${version}/Jensen_amd64.deb`, releaseUrl: 'https://github.com/r' })
const rpm = (version: string, byteSize: number) => ({ platform: 'linux', format: 'rpm', arch: 'x86_64', version, publishedAt: '2026-08-14T00:00:00Z', assetName: `Jensen-${version}.x86_64.rpm`, byteSize, downloadUrl: `https://github.com/jensen-org/releases/releases/download/${version}/Jensen.x86_64.rpm`, releaseUrl: 'https://github.com/r' })

const agent = (value: string) => Object.defineProperty(navigator, 'userAgent', { value, configurable: true })

const mountApp = () => mount(App)

const tabs = (wrapper: ReturnType<typeof mountApp>) => wrapper.findAll('.shelf-tab')
const active = (wrapper: ReturnType<typeof mountApp>) => tabs(wrapper).find((tab) => tab.attributes('aria-selected') === 'true')

afterEach(() => { vi.restoreAllMocks(); agent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)') })

describe('release card', () => {
  it('offers the newest build behind one download button', async () => {
    globalThis.fetch = vi.fn(() => response({ status: 'available', releaseUrl: 'https://github.com/r', builds: [mac('v1.4.0', 26004684), mac('v1.3.2', 25781043)] })) as unknown as typeof fetch
    const wrapper = mountApp()
    expect(wrapper.text()).toContain('Checking latest release')
    await vi.waitFor(() => expect(wrapper.findAll('a[download]')).toHaveLength(1))
    const link = wrapper.find('a[download]')
    expect(link.attributes('href')).toContain('v1.4.0')
    expect(link.attributes('aria-label')).toBe('Download Jensen for macOS v1.4.0')
    expect(wrapper.text()).toContain('Download for macOS')
    expect(wrapper.text()).toContain('v1.4.0')
    expect(wrapper.text()).toContain('24.8 MB')
    expect(wrapper.text()).toContain('2026-08-14')
    expect(wrapper.find('.releases-link[href="https://github.com/jensen-org/releases/releases"]').exists()).toBe(true)
  })

  it('keeps a disabled download button while the release is loading', () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch
    const wrapper = mountApp()
    expect(wrapper.find('.shelf-body button').attributes('disabled')).toBeDefined()
  })

  it('shows the coming soon notice with the download disabled', async () => {
    globalThis.fetch = vi.fn(() => response({ status: 'unavailable', releaseUrl: 'https://github.com/r' })) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.text()).toContain('macOS build coming soon'))
    expect(wrapper.findAll('a[download]')).toHaveLength(0)
    expect(wrapper.find('.shelf-body button').attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Download for macOS')
  })

  it('shows error and releases link', async () => {
    globalThis.fetch = vi.fn(() => response({ status: 'error', releaseUrl: 'https://github.com/jensen-org/releases/releases' })) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.text()).toContain('Release information unavailable'))
    expect(wrapper.find('.releases-link').attributes('href')).toContain('github.com')
  })

  it('falls back to the releases page when the request throws', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('offline'))) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.text()).toContain('Release information unavailable'))
    expect(wrapper.find('.releases-link').attributes('href')).toContain('jensen-org/releases/releases')
  })

  it('leads with the product headline', () => {
    globalThis.fetch = vi.fn(() => response({ status: 'unavailable', releaseUrl: 'https://github.com/r' })) as unknown as typeof fetch
    const wrapper = mountApp()
    expect(wrapper.find('h1').text()).toBe('An AI-first IDE for large, complex codebases')
    expect(wrapper.findAll('h1')).toHaveLength(1)
  })

  it('has no status pill and names the newest release in the footer', async () => {
    globalThis.fetch = vi.fn(() => response({ status: 'available', releaseUrl: 'https://github.com/r', builds: [mac('v1.4.0', 26004684), mac('v1.3.2', 25781043)] })) as unknown as typeof fetch
    const wrapper = mountApp()
    expect(wrapper.find('.pill').exists()).toBe(false)
    expect(wrapper.find('.baseline-status').text()).toBe('Beta')
    await vi.waitFor(() => expect(wrapper.find('.baseline-status').text()).toBe('Beta 1.4.0'))
  })

  it('sends the header and footer to the documentation instead of a demo', () => {
    globalThis.fetch = vi.fn(() => response({ status: 'unavailable', releaseUrl: 'https://github.com/r' })) as unknown as typeof fetch
    const wrapper = mountApp()
    expect(wrapper.find('.nav-docs').text()).toBe('Documentation')
    expect(wrapper.find('.nav-docs').attributes('href')).toBe('https://jensen-org.github.io/releases/')
    expect(wrapper.find('.nav-link').attributes('href')).toBe('https://github.com/jensen-org/releases/releases')
    expect(wrapper.find('.baseline-learn').attributes('href')).toBe('https://jensen-org.github.io/releases/')
    expect(wrapper.text()).not.toMatch(/demo/i)
    expect(wrapper.find('video').exists()).toBe(false)
  })

  it('says what Jensen is under the headline', () => {
    globalThis.fetch = vi.fn(() => response({ status: 'unavailable', releaseUrl: 'https://github.com/r' })) as unknown as typeof fetch
    const wrapper = mountApp()
    const sub = wrapper.find('.hero-sub')
    expect(sub.text()).toContain('Jensen integrates with your codebase and cuts the cognitive debt')
    expect(sub.text()).toContain('less for your agents to guess')
  })

  it('closes the page with the build status and the licence', () => {
    globalThis.fetch = vi.fn(() => response({ status: 'unavailable', releaseUrl: 'https://github.com/r' })) as unknown as typeof fetch
    const wrapper = mountApp()
    expect(wrapper.find('.baseline-status').text()).toBe('Beta')
    expect(wrapper.find('.baseline-legal').attributes('href')).toContain('jensen-org/releases/blob/main/LICENSE.md')
  })
})

describe('platform tabs', () => {
  const both = { status: 'available', releaseUrl: 'https://github.com/r', builds: [mac('v1.4.0', 26004684), deb('v1.4.0', 31447219), rpm('v1.4.0', 31890114)] }

  it('opens on the tab for the visitor operating system', async () => {
    agent('Mozilla/5.0 (X11; Linux x86_64)')
    globalThis.fetch = vi.fn(() => response(both)) as unknown as typeof fetch
    const wrapper = mountApp()
    expect(active(wrapper)!.text()).toBe('Linux')
    await vi.waitFor(() => expect(wrapper.find('a[download]').exists()).toBe(true))
    expect(active(wrapper)!.text()).toBe('Linux')
    expect(wrapper.find('.shelf-arch').text()).toBe('x86_64')
    expect(wrapper.find('a[download]').attributes('href')).toContain('amd64.deb')
  })

  it.each([
    ['an Android phone', 'Mozilla/5.0 (Linux; Android 14; Pixel 8)'],
    ['an iPhone', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148'],
  ])('shows the mobile note and nothing to download on %s', async (_name, ua) => {
    agent(ua)
    const fetchSpy = vi.fn(() => response(both))
    globalThis.fetch = fetchSpy as unknown as typeof fetch
    const wrapper = mountApp()
    await Promise.resolve()
    expect(wrapper.find('.shelf-body').text()).toContain('Wow mobile version? maybe later ;)')
    expect(tabs(wrapper).map((tab) => tab.text())).toEqual(['Mobile'])
    expect(active(wrapper)!.text()).toBe('Mobile')
    expect(wrapper.find('.cta').exists()).toBe(false)
    expect(wrapper.findAll('a[download]')).toHaveLength(0)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('treats a narrow or touch only screen as mobile even with a desktop user agent', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))
    const fetchSpy = vi.fn(() => response(both))
    globalThis.fetch = fetchSpy as unknown as typeof fetch
    const wrapper = mountApp()
    await Promise.resolve()
    expect(active(wrapper)!.text()).toBe('Mobile')
    expect(wrapper.findAll('a[download]')).toHaveLength(0)
    expect(fetchSpy).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('swaps the button, the architecture and the version line when a tab is chosen', async () => {
    globalThis.fetch = vi.fn(() => response(both)) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.find('a[download]').exists()).toBe(true))
    expect(active(wrapper)!.text()).toBe('macOS')
    expect(wrapper.find('.shelf-arch').text()).toBe('Apple Silicon')
    expect(wrapper.text()).toContain('v1.4.0 · 24.8 MB')

    await tabs(wrapper)[1].trigger('click')
    expect(active(wrapper)!.text()).toBe('Linux')
    expect(wrapper.find('.shelf-arch').text()).toBe('x86_64')
    expect(wrapper.text()).toContain('Download for Linux')
    expect(wrapper.text()).toContain('v1.4.0 · .deb · 30.0 MB')
    expect(wrapper.find('.shelf-body a[download]').attributes('aria-label')).toBe('Download Jensen for Linux v1.4.0, .deb package')
  })

  it('offers the rpm package beside the deb without a second button', async () => {
    globalThis.fetch = vi.fn(() => response(both)) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.find('a[download]').exists()).toBe(true))
    await tabs(wrapper)[1].trigger('click')
    expect(wrapper.findAll('.shelf-body button')).toHaveLength(0)
    const alternate = wrapper.find('.shelf-links a[download]')
    expect(alternate.text()).toBe('.rpm package')
    expect(alternate.attributes('href')).toContain('x86_64.rpm')
  })

  it('keeps a platform with no build on its own coming soon notice', async () => {
    globalThis.fetch = vi.fn(() => response({ status: 'available', releaseUrl: 'https://github.com/r', builds: [mac('v1.4.0', 26004684)] })) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.find('a[download]').exists()).toBe(true))
    await tabs(wrapper)[1].trigger('click')
    expect(wrapper.text()).toContain('Linux build coming soon')
    expect(wrapper.text()).toContain('Download for Linux')
    expect(wrapper.find('.shelf-body button').attributes('disabled')).toBeDefined()
  })

  it('reaches the other platform with the arrow keys', async () => {
    globalThis.fetch = vi.fn(() => response(both)) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.find('a[download]').exists()).toBe(true))
    await tabs(wrapper)[0].trigger('keydown', { key: 'ArrowRight' })
    expect(active(wrapper)!.text()).toBe('Linux')
    await tabs(wrapper)[1].trigger('keydown', { key: 'ArrowRight' })
    expect(active(wrapper)!.text()).toBe('macOS')
    await tabs(wrapper)[0].trigger('keydown', { key: 'End' })
    expect(active(wrapper)!.text()).toBe('Linux')
    await tabs(wrapper)[1].trigger('keydown', { key: 'Home' })
    expect(active(wrapper)!.text()).toBe('macOS')
    await tabs(wrapper)[0].trigger('keydown', { key: 'Enter' })
    expect(active(wrapper)!.text()).toBe('macOS')
  })

  it('leads with the newest version even when an older one shipped another format', async () => {
    globalThis.fetch = vi.fn(() => response({ status: 'available', releaseUrl: 'https://github.com/r', builds: [rpm('v1.4.0', 31890114), deb('v1.3.0', 31447219)] })) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.text()).not.toContain('Checking latest release'))
    await tabs(wrapper)[1].trigger('click')
    expect(wrapper.text()).toContain('Download for Linux')
    expect(wrapper.text()).toContain('v1.4.0 · .rpm')
    expect(wrapper.find('.shelf-links a[download]').exists()).toBe(false)
  })

  it('wires the tablist for assistive technology', async () => {
    globalThis.fetch = vi.fn(() => response(both)) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.find('a[download]').exists()).toBe(true))
    expect(wrapper.find('[role="tablist"]').attributes('aria-label')).toBe('Platform')
    expect(tabs(wrapper).map((tab) => tab.attributes('tabindex'))).toEqual(['0', '-1'])
    expect(wrapper.find('[role="tabpanel"]').attributes('aria-labelledby')).toBe('tab-macos')
    expect(wrapper.find('[role="tabpanel"]').attributes('id')).toBe('panel-macos')
  })
})
