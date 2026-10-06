// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { detectPlatform, isMobileDevice } from '../src/lib/platform'

describe('platform detection without a browser', () => {
  it('has no window in this environment', () => {
    expect(typeof window).toBe('undefined')
  })

  it('treats the server as a desktop', () => {
    expect(isMobileDevice()).toBe(false)
  })

  it('defaults the server to macOS', () => {
    expect(detectPlatform()).toBe('macos')
  })
})
