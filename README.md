# Jensen Release

The Jensen release page is a Vue 3 single page application for the Apple Silicon macOS build.

## Local development

Install Bun, then run `bun install` and `bun run dev`. The API endpoint is available at `/api/release` in Vercel. The optional `GITHUB_TOKEN` is server-only and raises GitHub API rate limits. Copy `.env.example` when needed.

## Releases

The endpoint reads published GitHub releases, including prereleases, and selects an Apple Silicon `.dmg` whose filename contains `arm64` or `aarch64`. Draft releases and other architectures are ignored. Asset and release links must be public `https://github.com/` URLs. `GITHUB_TOKEN` is optional and server-only.

## Deployment

Import the repository into Vercel. Vercel detects Vite and `api/release.ts` automatically. Add `GITHUB_TOKEN` only as a server environment variable if required. Security headers are defined in `vercel.json`.
