import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import QueryGraph from '../src/components/QueryGraph.vue'

const context = () => new Proxy({}, { get: (target, key) => (key in target ? (target as Record<string | symbol, unknown>)[key] : vi.fn()), set: (target, key, value) => { (target as Record<string | symbol, unknown>)[key] = value; return true } })

const observers = { resize: [] as { disconnect: ReturnType<typeof vi.fn> }[], visibility: [] as { disconnect: ReturnType<typeof vi.fn> }[] }

const stubBrowser = (reduced: boolean) => {
  vi.stubGlobal('matchMedia', () => ({ matches: reduced }))
  vi.stubGlobal('Path2D', class { moveTo() {} quadraticCurveTo() {} })
  vi.stubGlobal('ResizeObserver', class { disconnect = vi.fn(); observe() {}; constructor() { observers.resize.push(this) } })
  vi.stubGlobal('IntersectionObserver', class { disconnect = vi.fn(); observe() {}; constructor() { observers.visibility.push(this) } })
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context() as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 640, height: 640 } as DOMRect)
}

beforeEach(() => { observers.resize.length = 0; observers.visibility.length = 0 })
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })

describe('query graph figure', () => {
  it('stays out of the accessibility tree', () => {
    stubBrowser(true)
    const wrapper = mount(QueryGraph)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    wrapper.unmount()
  })

  it('renders one still frame with the diff under reduced motion', () => {
    stubBrowser(true)
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    const wrapper = mount(QueryGraph)
    expect(raf).not.toHaveBeenCalled()
    expect(wrapper.find('.query-text').text()).toBe('Why does checkout retry twice?')
    expect(wrapper.find('.diff-file').text()).toBe('payments/retry.ts')
    expect(wrapper.find('.diff-stat').text()).toBe('+2 −1')
    expect(wrapper.findAll('.row').map((row) => row.element.textContent)).toEqual([
      '  export function withRetry(fn, opts) {',
      '−   const max = opts.retries ?? 2;',
      '+   const max = opts.retries ?? 1;',
      '+   if (opts.idempotencyKey) return once(fn);',
      '    return retry(fn, max);',
    ])
    expect(wrapper.findAll('.row-removed')).toHaveLength(1)
    expect(wrapper.findAll('.row-added')).toHaveLength(2)
    expect((wrapper.find('.diff').element as HTMLElement).style.opacity).toBe('1')
    expect((wrapper.find('.stack').element as HTMLElement).style.transform).toBe('translateY(0px)')
    expect(wrapper.find('.query').classes()).toContain('query-expanded')
    expect(wrapper.findAll('.chip').map((chip) => chip.text())).toEqual(['payments/retry.ts', 'api/checkout.ts', 'lib/queue.ts'])
    wrapper.unmount()
  })

  it('runs on the animation clock and tears everything down on unmount', () => {
    stubBrowser(false)
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 7)
    const cancel = vi.spyOn(window, 'cancelAnimationFrame')
    const wrapper = mount(QueryGraph)
    expect(raf).toHaveBeenCalledTimes(1)
    wrapper.unmount()
    expect(cancel).toHaveBeenCalledWith(7)
    expect(observers.resize[0].disconnect).toHaveBeenCalled()
    expect(observers.visibility[0].disconnect).toHaveBeenCalled()
  })

  it('keeps the loop alive when a frame throws', () => {
    stubBrowser(false)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ scale() {}, clearRect() { throw new Error('bad frame') } } as unknown as CanvasRenderingContext2D)
    const frames: FrameRequestCallback[] = []
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => frames.push(callback))
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(QueryGraph)
    frames.shift()!(16)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(frames).toHaveLength(1)
    wrapper.unmount()
  })
})
