# Jensen Release

The Jensen release page is a Vue 3 single page application for the Apple Silicon macOS build, built with PrimeVue 4 components on a custom Aura preset.

## Local development

Install Bun, then run `bun install` and `bun run dev`. The API endpoint is available at `/api/release` in Vercel. The optional `GITHUB_TOKEN` is server-only and raises GitHub API rate limits. Copy `.env.example` when needed.

## Releases

The endpoint reads published GitHub releases, including prereleases, and returns every release carrying an Apple Silicon `.dmg` whose filename contains `arm64` or `aarch64`, newest first and capped at `MAX_BUILDS`. The page renders one download row per version. Draft releases and other architectures are ignored. Asset and release links must be public `https://github.com/` URLs. `GITHUB_TOKEN` is optional and server-only.

## The ring

The mark on the page is not decoration. It carries a 123 byte message as a polar lattice of
82 spokes by 12 rings, one bit per slot, and the geometry is sized so the message fills it
exactly with nothing left over.

- A drawn dot is a one. An empty slot is a zero.
- Bit *n* sits on ring `n / 82` counting outward, and spoke `n % 82` counting clockwise from
  twelve o'clock.
- Read the innermost ring clockwise from twelve o'clock, then each ring outward in turn, and
  group the bits into bytes. The first byte is `01010011`, a capital S.

`decodeMessage` in `src/lib/ring.ts` does this in code, and `tests/ring.test.ts` asserts the
rendered geometry still decodes to the original sentence.

## Deployment

Import the repository into Vercel. Vercel detects Vite and `api/release.ts` automatically. Add `GITHUB_TOKEN` only as a server environment variable if required. Security headers are defined in `vercel.json`.
