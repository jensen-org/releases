import type { Platform } from '../../api/release'

type UserAgentData = { platform?: string; mobile?: boolean }

const agentData = () => (navigator as Navigator & { userAgentData?: UserAgentData }).userAgentData

export function isMobileDevice(): boolean {
  if (agentData()?.mobile === true) return true
  const agent = navigator.userAgent
  if (/android|iphone|ipad|ipod|mobile/i.test(agent)) return true
  return /macintosh/i.test(agent) && navigator.maxTouchPoints > 1
}

export function detectPlatform(): Platform {
  const source = `${agentData()?.platform ?? ''} ${navigator.userAgent}`
  if (/linux|x11|cros|ubuntu|fedora/i.test(source)) return 'linux'
  return 'macos'
}
