import type { Platform } from '../../api/release'

type UserAgentData = { platform?: string }

export function detectPlatform(): Platform {
  const data = (navigator as Navigator & { userAgentData?: UserAgentData }).userAgentData
  const source = `${data?.platform ?? ''} ${navigator.userAgent}`
  if (/android/i.test(source)) return 'macos'
  if (/linux|x11|cros|ubuntu|fedora/i.test(source)) return 'linux'
  return 'macos'
}
