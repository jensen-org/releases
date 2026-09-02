import { mount } from '@vue/test-utils'
import { h } from 'vue'
import PrimeVue from 'primevue/config'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.vue'
import { preset } from '../src/theme'

vi.mock('../src/components/SignalRing.vue', () => ({ default: { render: () => h('canvas', { 'aria-label': 'Jensen signal ring' }) } }))

const response = (body: unknown) => Promise.resolve({ json: () => Promise.resolve(body) })
const build = (version: string, byteSize: number) => ({ version, publishedAt: '2026-08-14T00:00:00Z', byteSize, downloadUrl: `https://github.com/jensen-org/jensen-release/releases/download/${version}/Jensen-arm64.dmg`, releaseUrl: 'https://github.com/r' })

const mountApp = () => mount(App, { global: { plugins: [[PrimeVue, { ripple: false, theme: { preset, options: { darkModeSelector: false } } }]], components: { Card, DataTable, Column, Button, Tag, Message } } })

afterEach(() => vi.restoreAllMocks())

describe('release card', () => {
  it('lists every build newest first with a direct download each', async () => {
    globalThis.fetch = vi.fn(() => response({ status: 'available', releaseUrl: 'https://github.com/r', builds: [build('v1.4.0', 26004684), build('v1.3.2', 25781043)] })) as unknown as typeof fetch
    const wrapper = mountApp()
    expect(wrapper.text()).toContain('Checking latest release')
    await vi.waitFor(() => expect(wrapper.findAll('a[download]')).toHaveLength(2))
    const links = wrapper.findAll('a[download]')
    expect(links[0].attributes('href')).toContain('v1.4.0')
    expect(links[0].attributes('aria-label')).toBe('Download Jensen for macOS v1.4.0')
    expect(links[1].attributes('href')).toContain('v1.3.2')
    expect(wrapper.text()).toContain('24.8 MB')
    expect(wrapper.text()).toContain('2026-08-14')
    expect(wrapper.text()).toContain('Latest')
  })

  it('shows the coming soon notice with no downloads', async () => {
    globalThis.fetch = vi.fn(() => response({ status: 'unavailable', releaseUrl: 'https://github.com/r' })) as unknown as typeof fetch
    const wrapper = mountApp()
    await vi.waitFor(() => expect(wrapper.text()).toContain('macOS build coming soon'))
    expect(wrapper.findAll('a[download]')).toHaveLength(0)
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
