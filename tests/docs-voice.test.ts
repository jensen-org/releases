import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { redirects } from '../docs-site/src/redirects.mjs'
import { sidebar } from '../docs-site/src/sidebar.mjs'

const root = 'docs-site/src/content/docs'

const walk = (path: string): string[] =>
  statSync(path).isDirectory() ? readdirSync(path).flatMap((entry) => walk(join(path, entry))) : [path]

const pages = walk(root).filter((file) => /\.(md|mdx)$/.test(file))

const filler = /\b(just|simply|really|actually|basically|completely|automatically|deliberately|obviously|easily|directly|exactly|silently|fully|entirely|plainly|quietly|simple|really)\b/i

const prose = (source: string): string =>
  source
    .replace(/^---[\s\S]*?\n---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '')
    .replace(/\*\*[^*\n]*\*\*/g, '')
    .replace(/\*[^*\n]*\*/g, '')
    .replace(/"[^"\n]*"/g, '')
    .replace(/\]\([^)]*\)/g, ']')

const pageExists = (route: string): boolean => {
  const path = route.replace(/#.*$/, '').replace(/^\/|\/$/g, '')
  return existsSync(join(root, `${path}.md`)) || existsSync(join(root, `${path}.mdx`))
}

describe('documentation voice', () => {
  it('has no filler words in prose', () => {
    const offenders = pages.flatMap((file) =>
      prose(readFileSync(file, 'utf8'))
        .split('\n')
        .filter((line) => filler.test(line))
        .map((line) => `${file}: ${line.trim()}`),
    )
    expect(offenders).toEqual([])
  })

  it('uses no em or en dashes', () => {
    const offenders = pages.filter((file) => /[–—]/.test(readFileSync(file, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('uses no spaced hyphen as a separator', () => {
    const offenders = pages.flatMap((file) =>
      prose(readFileSync(file, 'utf8'))
        .split('\n')
        .filter((line) => /\S - \S/.test(line))
        .map((line) => `${file}: ${line.trim()}`),
    )
    expect(offenders).toEqual([])
  })
})

describe('documentation structure', () => {
  it('has a page for every sidebar entry', () => {
    const slugs = sidebar.flatMap((group) => group.items.map((item) => item.slug))
    expect(slugs.filter((slug) => !pageExists(slug))).toEqual([])
  })

  it('redirects every removed page to one that exists', () => {
    const broken = Object.entries(redirects).filter(([, target]) => !pageExists(target))
    expect(broken).toEqual([])
  })

  it('links only to pages that exist', () => {
    const offenders = pages.flatMap((file) =>
      [...readFileSync(file, 'utf8').matchAll(/\]\((\/[^)\s]*)\)/g)]
        .map((match) => match[1])
        .filter((route) => !pageExists(route))
        .map((route) => `${file}: ${route}`),
    )
    expect(offenders).toEqual([])
  })
})
