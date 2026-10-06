import { track } from '@vercel/analytics'

export function trackDownloads(root: Document): void {
  root.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[download]')
    if (!link) return
    const os = root.querySelector('[role="tab"][aria-selected="true"]')?.id.replace(/^tab-/, '') ?? 'unknown'
    const format = new URL(link.href, root.baseURI).pathname.split('.').pop() ?? 'unknown'
    track('download', { os, format })
  })
}
