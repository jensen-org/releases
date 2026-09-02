# Jensen Release

The Jensen release page is a Vue 3 single page application for the Apple Silicon macOS build, built with PrimeVue 4 components on a custom Aura preset.

## Local development

Install Bun, then run `bun install` and `bun run dev`. The API endpoint is available at `/api/release` in Vercel. The optional `GITHUB_TOKEN` is server-only and raises GitHub API rate limits. Copy `.env.example` when needed.

## Releases

The endpoint reads published GitHub releases, including prereleases, and returns every release carrying an Apple Silicon `.dmg` whose filename contains `arm64` or `aarch64`, newest first and capped at `MAX_BUILDS`. The page offers the newest build as a single download, with the GitHub releases page linked for the rest. Draft releases and other architectures are ignored. Asset and release links must be public `https://github.com/` URLs. `GITHUB_TOKEN` is optional and server-only.

## The ring

The mark on the page is not decoration. It carries a 262 byte message as a polar lattice of
131 spokes by 16 rings, one bit per slot, and the geometry is sized so the message fills it
exactly with nothing left over.

- A drawn dot is a one. An empty slot is a zero.
- Bit *n* sits on ring `n / 131` counting outward, and spoke `n % 131` counting clockwise from
  twelve o'clock.
- Read the innermost ring clockwise from twelve o'clock, then each ring outward in turn, and
  group the bits into bytes. The first byte is `01010011`, a capital S.
- `MESSAGE` must stay exactly `SPOKES * POSITIONS / 8` bytes long. Reword it freely, but keep that
  byte count or pick a new pair of lattice dimensions to match.
- `dotRadius` sizes a dot against the lattice so slots never touch at any ring size, which
  `tests/ring.test.ts` asserts as a minimum clearance on the static geometry.

`decodeMessage` in `src/lib/ring.ts` does this in code, and `tests/ring.test.ts` asserts the
rendered geometry still decodes to the original sentence.

## The motion

The lattice is where each dot lives, not where it sits. `createRingSim` runs a particle
simulation and the canvas only draws it, so the entrance and the idle loop are one continuous
system rather than an animation that hands off to another.

- The ring opens with a fade, staggered from the inner band outward over about a second, and
  every dot is `#0E0E0D` at full opacity and full radius from then on. Nothing modulates a dot's
  ink once the reveal is done, because at a two pixel radius a change in opacity or size is
  indistinguishable from a change in colour. All of the steady state life comes from position.
- Each particle is a spring anchored to its lattice slot, damped a little under critical so it
  overshoots once. `OMEGA` sets the rate and `ZETA` the damping.
- The anchor itself moves. Rings twist against each other by `SHEAR` and the whole lattice
  breathes by `BREATH`, both driven by the same noise, so particles chase a target that is
  already alive. Twist is a rigid rotation per ring and breath is a uniform scale, so neither
  can bring two dots closer than the radial gap no matter how far they are pushed.
- Ambient wander comes from the curl of a 3D gradient noise field, sampled at the particle's
  home so the equation stays linear and the spring cannot amplify how far neighbours separate.
  Curl is divergence free, which is why the flow swirls instead of collecting dots into sinks.
- The whole lattice also turns slowly by `SPIN`, so the mark is never twice in the same place.
- `noise3` is a hashed lattice, so the simulation is deterministic with no seeding. Vitest and
  the browser produce identical frames at a fixed timestep.
- Motion amplitude scales with `budget`, the air left between slots, not with the ring size.
  `dotRadius` bottoms out at one pixel below a 300 pixel ring while the gaps keep shrinking, so
  anything scaled to the ring would close them.
- `tests/ring.test.ts` runs the simulation and measures the true closest pair through a spatial
  hash. It also asserts the particles keep moving, so damping the ring to death fails the suite.

## Deployment

Import the repository into Vercel. Vercel detects Vite and `api/release.ts` automatically. Add `GITHUB_TOKEN` only as a server environment variable if required. Security headers are defined in `vercel.json`.
