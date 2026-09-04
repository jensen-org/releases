import { mount } from '@vue/test-utils'
import { h } from 'vue'
import PrimeVue from 'primevue/config'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.vue'
import { preset } from '../src/theme'

vi.mock('../src/components/SignalRing.vue', () => ({ default: { render: () => h('canvas', { 'aria-label': 'Jensen signal ring' }) } }))
vi.mock('../src/components/OrbitField.vue', () => ({ default: { render: () => h('svg', { class: 'orbit-field' }) } }))

const response = (body: unknown) => Promise.resolve({ json: () => Promise.resolve(body) })

const mac = (version: string, byteSize: number) => ({ platform: 'macos', format: 'dmg', arch: 'arm64', version, publishedAt: '2026-08-14T00:00:00Z', assetName: `Jensen-${version}-arm64.dmg`, byteSize, downloadUrl: `https://github.com/jensen-org/releases/releases/download/${version}/Jensen-arm64.dmg`, releaseUrl: 'https://github.com/r' })
const deb = (version: string, byteSize: number) => ({ platform: 'linux', format: 'deb', arch: 'x86_64', version, publishedAt: '2026-08-14T00:00:00Z', assetName: `Jensen_${version}_amd64.deb`, byteSize, downloadUrl: `https://github.com/jensen-org/releases/releases/download/${version}/Jensen_amd64.deb`, releaseUrl: 'https://github.com/r' })
const rpm = (version: string, byteSize: number) => ({ platform: 'linux', format: 'rpm', arch: 'x86_64', version, publishedAt: '2026-08-14T00:00:00Z', assetName: `Jensen-${version}.x86_64.rpm`, byteSize, downloadUrl: `https://github.com/jensen-org/releases/releases/download/${version}/Jensen.x86_64.rpm`, releaseUrl: 'https://github.com/r' })

const agent = (value: string) => Object.defineProperty(navigator, 'userAgent', { value, configurable: true })

globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} } as unknown as typeof ResizeObserver

const mountApp = () => mount(App, { global: { plugins: [[PrimeVue, { ripple: false, theme: { preset, options: { darkModeSelector: false } } }]], components: { Card, Button } } })

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

  it('leads with the product headline and keeps the card title beneath it', () => {
    globalThis.fetch = vi.fn(() => response({ status: 'unavailable', releaseUrl: 'https://github.com/r' })) as unknown as typeof fetch
    const wrapper = mountApp()
    expect(wrapper.find('h1').text()).toBe('An AI-first IDE for large, complex codebases')
    expect(wrapper.find('.hero-headline').element.tagName).toBe('H1')
    expect(wrapper.find('.shelf-title').text()).toBe('Download Jensen')
    expect(wrapper.find('.shelf-title').element.tagName).toBe('H2')
  })

  it('says what Jensen is under the headline', () => {
    globalThis.fetch = vi.fn(() => response({ status: 'unavailable', releaseUrl: 'https://github.com/r' })) as unknown as typeof fetch
    const wrapper = mountApp()
    const sub = wrapper.find('.hero-sub')
    expect(sub.text()).toContain('Jensen integrates with your codebase and cuts the cognitive debt')
    expect(sub.text()).toContain('less for your agents to guess')
    expect(wrapper.find('.hero-learn').attributes('href')).toBe('https://jensen-org.github.io/releases/')
    expect(wrapper.find('.hero-learn').text()).toContain('Learn more')
  })

  it('closes the page with the build status and the licence', () => {
    globalThis.fetch = vi.fn(() => response({ status: 'unavailable', releaseUrl: 'https://github.com/r' })) as unknown as typeof fetch
    const wrapper = mountApp()
    expect(wrapper.find('.baseline-status').text()).toContain('Beta 0.1.0')
    expect(wrapper.find('.baseline-legal').attributes('href')).toContain('jensen-org/releases/blob/main/LICENSE.md')
  })
})

describe('platform tabs', () => {
  const both = { status: 'available', releaseUrl: 'https://github.com/r', builds: [mac('v1.4.0', 26004684), deb('v1.4.0', 31447219), rpm('v1.4.0', 31890114)] }

  it('opens on the tab for the visitor operating system', async () => {
    agent('Mozilla/5.0 (X11; Linux x86_64)')
    globalThis.fetch = vi.fn(() => response(both)) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.find('a[download]').exists()).toBe(true))
    expect(active(wrapper)!.text()).toBe('Linux')
    expect(wrapper.find('.shelf-arch').text()).toBe('x86_64')
    expect(wrapper.find('a[download]').attributes('href')).toContain('amd64.deb')
  })

  it('treats an Android browser as macOS rather than Linux', async () => {
    agent('Mozilla/5.0 (Linux; Android 14; Pixel 8)')
    globalThis.fetch = vi.fn(() => response(both)) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.find('a[download]').exists()).toBe(true))
    expect(active(wrapper)!.text()).toBe('macOS')
  })

  it('swaps the button, the architecture and the version line when a tab is chosen', async () => {
    globalThis.fetch = vi.fn(() => response(both)) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.find('a[download]').exists()).toBe(true))
    expect(active(wrapper)!.text()).toBe('macOS')
    expect(wrapper.find('.shelf-arch').text()).toBe('Apple Silicon')
    expect(wrapper.text()).toContain('24.8 MB')

    await tabs(wrapper)[1].trigger('click')
    expect(active(wrapper)!.text()).toBe('Linux')
    expect(wrapper.find('.shelf-arch').text()).toBe('x86_64')
    expect(wrapper.text()).toContain('Download .deb')
    expect(wrapper.text()).toContain('30.0 MB')
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

  it('wires the tablist for assistive technology', async () => {
    globalThis.fetch = vi.fn(() => response(both)) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.find('a[download]').exists()).toBe(true))
    expect(wrapper.find('[role="tablist"]').attributes('aria-labelledby')).toBe('shelf-title')
    expect(tabs(wrapper).map((tab) => tab.attributes('tabindex'))).toEqual(['0', '-1'])
    expect(wrapper.find('[role="tabpanel"]').attributes('aria-labelledby')).toBe('tab-macos')
    expect(wrapper.find('[role="tabpanel"]').attributes('id')).toBe('panel-macos')
  })
})
