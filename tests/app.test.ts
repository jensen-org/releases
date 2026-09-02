import { mount } from '@vue/test-utils'
import { h } from 'vue'
import PrimeVue from 'primevue/config'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.vue'
import { preset } from '../src/theme'

vi.mock('../src/components/SignalRing.vue', () => ({ default: { render: () => h('canvas', { 'aria-label': 'Jensen signal ring' }) } }))

const response = (body: unknown) => Promise.resolve({ json: () => Promise.resolve(body) })
const build = (version: string, byteSize: number) => ({ version, publishedAt: '2026-08-14T00:00:00Z', byteSize, downloadUrl: `https://github.com/jensen-org/jensen-release/releases/download/${version}/Jensen-arm64.dmg`, releaseUrl: 'https://github.com/r' })

const mountApp = () => mount(App, { global: { plugins: [[PrimeVue, { ripple: false, theme: { preset, options: { darkModeSelector: false } } }]], components: { Card, Button } } })

afterEach(() => vi.restoreAllMocks())

describe('release card', () => {
  it('offers the newest build behind one download button', async () => {
    globalThis.fetch = vi.fn(() => response({ status: 'available', releaseUrl: 'https://github.com/r', builds: [build('v1.4.0', 26004684), build('v1.3.2', 25781043)] })) as unknown as typeof fetch
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
  })

  it('keeps a disabled download button while the release is loading', () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch
    const wrapper = mountApp()
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('shows the coming soon notice with the download disabled', async () => {
    globalThis.fetch = vi.fn(() => response({ status: 'unavailable', releaseUrl: 'https://github.com/r' })) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.text()).toContain('macOS build coming soon'))
    expect(wrapper.findAll('a[download]')).toHaveLength(0)
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Download for macOS')
  })

  it('shows error and releases link', async () => {
    globalThis.fetch = vi.fn(() => response({ status: 'error', releaseUrl: 'https://github.com/jensen-org/jensen-release/releases' })) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.text()).toContain('Release information unavailable'))
    expect(wrapper.find('.releases-link').attributes('href')).toContain('github.com')
  })

  it('falls back to the releases page when the request throws', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('offline'))) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.text()).toContain('Release information unavailable'))
    expect(wrapper.find('.releases-link').attributes('href')).toContain('jensen-org/jensen-release/releases')
  })

  it('keeps the page heading', () => {
    globalThis.fetch = vi.fn(() => response({ status: 'unavailable', releaseUrl: 'https://github.com/r' })) as unknown as typeof fetch
    expect(mountApp().find('h1').text()).toBe('Jensen for macOS')
  })
})
