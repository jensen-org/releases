export type Platform = 'macos' | 'linux'
export type Format = 'dmg' | 'deb' | 'rpm'
export type Build = { platform: Platform; format: Format; arch: string; version: string; publishedAt: string; assetName: string; byteSize: number; digest?: string; downloadUrl: string; releaseUrl: string }
export type AvailableRelease = { status: 'available'; builds: Build[]; releaseUrl: string }
export type UnavailableRelease = { status: 'unavailable'; releaseUrl: string }
export type ErrorRelease = { status: 'error'; code: 'RATE_LIMITED' | 'UPSTREAM_UNAVAILABLE' | 'MALFORMED_RESPONSE' | 'METHOD_NOT_ALLOWED'; releaseUrl: string }
export type ReleaseResponse = AvailableRelease | UnavailableRelease | ErrorRelease
export const MAX_BUILDS = 4
export const PLATFORMS: Platform[] = ['macos', 'linux']
type Asset = { name?: unknown; size?: unknown; browser_download_url?: unknown; digest?: unknown }
type GitRelease = { draft?: unknown; tag_name?: unknown; published_at?: unknown; html_url?: unknown; assets?: unknown }
const repo = 'jensen-org/releases'
export const releasesUrl = `https://github.com/${repo}/releases`
const KINDS: { format: Format; platform: Platform; suffix: RegExp; require?: RegExp }[] = [
  { format: 'dmg', platform: 'macos', suffix: /^.+\.dmg$/i, require: /(arm64|aarch64)/i },
  { format: 'deb', platform: 'linux', suffix: /^.+\.deb$/i },
  { format: 'rpm', platform: 'linux', suffix: /^.+\.rpm$/i },
]
export function classifyAsset(name: string): { platform: Platform; format: Format; arch: string } | null {
  const kind = KINDS.find((entry) => entry.suffix.test(name) && (!entry.require || entry.require.test(name)))
  return kind ? { platform: kind.platform, format: kind.format, arch: /(arm64|aarch64)/i.test(name) ? 'arm64' : 'x86_64' } : null
}
function isPublicGithubUrl(value: unknown): value is string { try { const url = new URL(String(value)); return url.protocol === 'https:' && (url.hostname === 'github.com' || url.hostname === 'objects.githubusercontent.com') } catch { return false } }
export function selectReleases(payload: unknown): ReleaseResponse {
  if (!Array.isArray(payload)) return { status: 'error', code: 'MALFORMED_RESPONSE', releaseUrl: releasesUrl }
  const builds = (payload as GitRelease[])
    .filter((release) => release.draft !== true && typeof release.tag_name === 'string' && release.tag_name.length > 0 && typeof release.published_at === 'string' && !Number.isNaN(Date.parse(release.published_at)) && isPublicGithubUrl(release.html_url) && Array.isArray(release.assets))
    .map((release) => ({ release, assets: (release.assets as Asset[]).filter((asset) => typeof asset.name === 'string' && classifyAsset(asset.name) !== null && isPublicGithubUrl(asset.browser_download_url) && typeof asset.size === 'number' && asset.size > 0) }))
    .filter((entry) => entry.assets.length)
    .sort((a, b) => Date.parse(String(b.release.published_at)) - Date.parse(String(a.release.published_at)))
    .slice(0, MAX_BUILDS)
    .flatMap(({ release, assets }) => {
      const taken = new Set<Format>()
      return assets
        .sort((a, b) => Number(/arm64/i.test(String(b.name))) - Number(/arm64/i.test(String(a.name))))
        .flatMap((asset) => {
          const kind = classifyAsset(asset.name as string)!
          if (taken.has(kind.format)) return []
          taken.add(kind.format)
          return [{ ...kind, version: release.tag_name as string, publishedAt: release.published_at as string, assetName: asset.name as string, byteSize: asset.size as number, ...(typeof asset.digest === 'string' ? { digest: asset.digest } : {}), downloadUrl: asset.browser_download_url as string, releaseUrl: release.html_url as string }]
        })
    })
  if (!builds.length) return { status: 'unavailable', releaseUrl: releasesUrl }
  return { status: 'available', builds, releaseUrl: builds[0].releaseUrl }
}

type VercelRequest = { method?: string }
type VercelResponse = { status: (code: number) => VercelResponse; json: (value: unknown) => VercelResponse; setHeader: (name: string, value: string) => VercelResponse }
export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=300')
  if (request.method !== 'GET') return response.status(405).json({ status: 'error', code: 'METHOD_NOT_ALLOWED', releaseUrl: releasesUrl })
  try {
    const upstream = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`, { headers: { Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) } })
    if (!upstream.ok) return response.status(200).json({ status: 'error', code: upstream.status === 403 || upstream.status === 429 ? 'RATE_LIMITED' : 'UPSTREAM_UNAVAILABLE', releaseUrl: releasesUrl })
    return response.status(200).json(selectReleases(await upstream.json()))
  } catch { return response.status(200).json({ status: 'error', code: 'UPSTREAM_UNAVAILABLE', releaseUrl: releasesUrl }) }
}
