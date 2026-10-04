import type { Platform } from '../../api/release'

type UserAgentData = { platform?: string; mobile?: boolean }

const agentData = () => (navigator as Navigator & { userAgentData?: UserAgentData }).userAgentData

export const MOBILE_QUERY = '(max-width: 640px), (hover: none) and (pointer: coarse)'

const matches = (query: string) => typeof window.matchMedia === 'function' && window.matchMedia(query).matches

export function isMobileDevice(): boolean {
  if (agentData()?.mobile === true) return true
  const agent = navigator.userAgent
  if (/android|iphone|ipad|ipod|mobile/i.test(agent)) return true
  if (/macintosh/i.test(agent) && navigator.maxTouchPoints > 1) return true
  return matches(MOBILE_QUERY)
}

export function detectPlatform(): Platform {
  const source = `${agentData()?.platform ?? ''} ${navigator.userAgent}`
  if (/linux|x11|cros|ubuntu|fedora/i.test(source)) return 'linux'
  return 'macos'
}
