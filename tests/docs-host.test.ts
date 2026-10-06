import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const walk = (path: string): string[] =>
  statSync(path).isDirectory() ? readdirSync(path).flatMap((entry) => walk(join(path, entry))) : [path]

const stale = 'jensen-org.github.io'

describe('documentation host', () => {
  it('no longer references the github.io address', () => {
    const files = [...walk('src'), ...walk('docs-site/src'), ...walk('tests'), 'README.md', 'docs-site/README.md', 'docs-site/astro.config.mjs']
      .filter((file) => !file.endsWith('docs-host.test.ts'))
    const offenders = files.filter((file) => readFileSync(file, 'utf8').includes(stale))
    expect(offenders).toEqual([])
  })

  it('publishes the custom domain and points crawlers at the sitemap', () => {
    expect(readFileSync('docs-site/public/CNAME', 'utf8').trim()).toBe('docs.jensen-ide.com')
    expect(readFileSync('docs-site/public/robots.txt', 'utf8')).toContain('Sitemap: https://docs.jensen-ide.com/sitemap-index.xml')
  })
})
