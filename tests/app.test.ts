import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.vue'
vi.mock('../src/components/ScanningEye.vue', () => ({ default: { render: () => h('canvas', { 'aria-label': 'Jensen scanning eye' }) } }))
const response = (body: unknown) => Promise.resolve({ json: () => Promise.resolve(body) })
afterEach(() => vi.restoreAllMocks())
describe('download card states', () => {
  const mountApp = () => mount(App, { global: { stubs: { Card: { template: '<div><slot name="content" /></div>' }, Button: { props: ['label', 'disabled', 'loading'], template: '<button :disabled="disabled">{{ label }}</button>' } } } })
  it('shows loading then available direct download', async () => { globalThis.fetch = vi.fn(() => response({ status: 'available', version: '1.2.3', byteSize: 1048576, downloadUrl: 'https://github.com/a.dmg', releaseUrl: 'https://github.com/r' })) as unknown as typeof fetch; const wrapper = mountApp(); expect(wrapper.text()).toContain('Checking latest release'); await vi.waitFor(() => expect(wrapper.text()).toContain('Download for macOS')); expect(wrapper.find('a[download]').attributes('href')).toBe('https://github.com/a.dmg') })
  it('shows unavailable disabled label', async () => { globalThis.fetch = vi.fn(() => response({ status: 'unavailable', releaseUrl: 'https://github.com/r' })) as unknown as typeof fetch; const wrapper = mountApp(); await vi.waitFor(() => expect(wrapper.text()).toContain('macOS build coming soon')); expect(wrapper.find('button').attributes('disabled')).toBeDefined() })
  it('shows error and releases link', async () => { globalThis.fetch = vi.fn(() => response({ status: 'error', releaseUrl: 'https://github.com/jensen-org/jensen-release/releases' })) as unknown as typeof fetch; const wrapper = mountApp(); await vi.waitFor(() => expect(wrapper.text()).toContain('Release information unavailable')); expect(wrapper.find('.releases-link').attributes('href')).toContain('github.com') })
})
