# Jensen Release

The Jensen release page is a Vue 3 single page application offering the macOS and Linux builds behind a platform tab, built with PrimeVue 4 components on a custom Aura preset.

## Local development

Install Bun, then run `bun install` and `bun run dev`. Vercel serves `/api/release` in production; the dev server answers it from `tests/fixtures/releases.json` so the download card is usable locally, and `VITE_RELEASE_LIVE=1` reads the real GitHub feed instead. `GITHUB_TOKEN` is server-only and raises GitHub API rate limits. Copy `.env.example` when needed.

## Releases

The endpoint reads published GitHub releases, including prereleases, and classifies each asset by platform: an Apple Silicon `.dmg` whose filename contains `arm64` or `aarch64` is macOS, a `.deb` or `.rpm` is Linux. Releases come back newest first, capped at `MAX_BUILDS`, one build per format per release. The card groups them behind a platform tab and offers the newest build for the active platform, with the GitHub releases page linked for the rest. Draft releases and other architectures are ignored. `/api/release` does not exist under `vite dev`, so the dev server serves `tests/fixtures/releases.json` through the same selector; set `VITE_RELEASE_LIVE=1` to read the real GitHub feed instead. Asset and release links must be public `https://github.com/` URLs. `GITHUB_TOKEN` is optional and server-only.

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
- `FRAME` insets the whole mark inside its canvas. The simulation breathes and shears the lattice
  to about six percent past the outer band, and at the old inset of none that overshoot was clipped
  flat against the canvas edge. Every size in this file is inset with it, so the CSS box is divided
  by `FRAME` in turn and the drawn mark, its dots and its motion are all unchanged; the canvas
  simply carries the room the overshoot needs.

`decodeMessage` in `src/lib/ring.ts` does this in code, and `tests/ring.test.ts` asserts the
rendered geometry still decodes to the original sentence.

## The orbit

The concentric circles around the mark are a separate layer. `OrbitField.vue` renders an SVG
sibling inside the same box and reads nothing from the ring, so `SignalRing.vue` and `ring.ts` are
untouched by any of it and the simulation never learns the layer exists.

- A containment circle sits at `0.98` of the box radius, outside the six percent the simulation
  overshoots, so a breathing dot never crosses it.
- The graduated circle carries one tick per spoke of the lattice, `SPOKES` of them, so the scale is
  the mark's own resolution made visible rather than an arbitrary number of marks. Below a 420 pixel
  box the count halves, because at that size the ticks close into a solid band.
- A bracketed arc at `1.9` of the box radius runs only through the eastern half, so it crops against
  the right edge of the viewport and never reaches the copy. It is dropped below 1024 pixels.
- Two nodes ride the graduated circle, drifting at different rates and in opposite directions. On a
  fine pointer they ease toward the pointer's own angle at different strengths, which is the only
  thing on the page that answers the mouse besides the download button.
- Strokes are `--edge` and `--haze` and the nodes are `--ink`, so the diffusion flip inverts the
  layer with the rest of the page and it needs no special case. Under `prefers-reduced-motion` the
  loop never starts and the nodes park at their rest angles.

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
  `dotRadius` bottoms out at one pixel below a 323 pixel canvas while the gaps keep shrinking, so
  anything scaled to the ring would close them.
- `tests/ring.test.ts` runs the simulation and measures the true closest pair through a spatial
  hash. It also asserts the particles keep moving, so damping the ring to death fails the suite.

## The type

Two faces, and the split is a rule rather than a judgement call each time: Poppins sets display
and human language, JetBrains Mono sets machine-readable values. The version, the byte size, the
date, "Apple Silicon", the beta number and the licence are mono. The headline, the lede, the card
title and both button labels are Poppins. Mono already has uniform advance widths, so wherever it
is used the tracking drops to `--track-mono`, roughly half what the sans labels carry, or it
sprawls at nine pixels.

Both faces are self-hosted from `public/fonts`. `vercel.json` sets `font-src 'self'`, so a Google
Fonts link or `@import` is blocked in production; a new face has to be a file and a fourth
`@font-face`, never a stylesheet from someone else's origin.

## The flip

The page has two themes and it moves between them by diffusion, not by a fade or a sweep. The
ring's dots liquefy, ink spreads out of the lattice and floods the viewport until it has eaten the
page, and the dots then settle back into the lattice in the theme that arrived. It runs the first
time five to ten seconds in, then every fifteen to forty, and takes 3.2 seconds.

- The dark palette is the **exact difference-inverse** of the light one, `255 - v` per channel, in
  both `style.css` and the PrimeVue preset. That is not an aesthetic choice, it is what makes the
  hand-off seamless, and the cool cast that falls out of inverting warm paper is the point.
- `DiffusionVeil.vue` paints white into a fixed full-viewport canvas composited with
  `mix-blend-mode: difference`. On a monochrome page that is exact inversion: white flips what is
  under it, transparent changes nothing. Light to dark reads as black ink flooding paper; dark to
  light is the same code and shows the ink as white on black.
- Seeds come from **the ring's own pixels**. The canvas is drawn into a 150 pixel scratch canvas
  once at ignition and every lit pixel becomes a seed, so the front starts exactly where the dots
  are, including whatever spin and shear the simulation had reached.
- The ink is a **level set through a Perlin landscape**, not a cloud of particles. Height is the
  chamfer distance from those seeds, raised to a power so it climbs steeply at the dots, minus four
  octaves of fractal noise. A threshold sweeps from the lowest cell to the highest, so the front
  always begins at the mark, grows in organic lobes rather than as a circle, and closes exactly as
  the level tops out. Particles gave a furry, stippled edge; a level set is smooth at any scale
  because the boundary is an interpolated contour rather than a spray of marks.
- **The landscape moves under the front.** The noise is built at four depths and interpolated as
  progress advances, so the boundary keeps reshaping while it travels instead of revealing a fixed
  outline. Depths sit close together in the noise: spacing them further apart decorrelates them,
  and averaging two decorrelated fields flattens the amplitude that gives the front its shape.
- **Wetted cells are held at their high-water mark.** Without that, a morphing landscape would lift
  a cell back above the level and the ink would visibly recede. With it the front writhes and the
  page only ever gets wetter, which is both what ink does and what the tests assert.
- The field is 420 cells on its long side and is drawn upscaled with smoothing, so boundary detail
  and per-frame cost are traded against each other, never against sharpness. The noise itself is
  evaluated on a half-scale grid and interpolated, a quarter of the work for the same picture.
- **The build is sliced across frames, and this is load bearing.** Distance transform, noise and
  heights together take about twenty milliseconds, so doing them in one go cost the ring a visible
  stall right as the diffusion began. `buildField` is a generator that yields between row bands and
  the veil drains it against a six millisecond budget per frame, which lands in three frames here
  and degrades gracefully on slower machines. `tests/diffusion.test.ts` asserts the yield count, so
  collapsing it back into one step fails the suite.
- The ring's ink level is an inline `opacity` on the canvas element, not a custom property on the
  root. A custom property there invalidates every element that reads one, on every frame of the
  transition.
- `SignalRing.vue` and `ring.ts` are not touched by any of this. Dark mode reaches the mark through
  `filter: invert(1)` on the element, which leaves the backing store writing `#0E0E0D` in both
  themes, and the dots empty out of the lattice through an opacity the veil sets on the element
  from outside. The simulation never learns that a flip happened.
- The dots ride on the same canvas, composited with `difference` there, which gives the same
  picture as stacking a second difference layer over the page for half the blended area. They are
  drawn fresh every frame with the ring's own hard edge, and stay local to the mark; spreading
  across the page is the ink's job.
- Three things cost this transition its frame rate before they were found, and all three are worth
  keeping in mind before changing the drawing: `imageSmoothingQuality: 'high'` is a CPU resample in
  Chrome and made the upscale eight times slower than bilinear; a second full-viewport blended
  layer roughly doubled the compositing; and a live CSS `filter` on the animated grain made dark
  mode permanently more expensive than light, so that inversion is baked into the image instead.
- The last frame hard-fills the veil to solid white, and the next one swaps `data-theme`, updates
  `theme-color` and clears the canvas together. `difference(14, 255)` and `invert(14)` are both 241,
  so nothing moves on the seam.
- The schedule stands down while the tab is hidden, defers six seconds while the pointer is over
  the download card or a control holds focus, and never starts at all under
  `prefers-reduced-motion`. `?diffusion=off` disables it and `?diffusion=now` runs one immediately,
  which is how the end-to-end tests stay deterministic.

## Deployment

Import `jensen-org/releases` into Vercel. Vercel detects Vite from `bun.lock`, builds to `dist`, and turns
`api/release.ts` into a Node function at `/api/release`. Production deploys from `main`. Security headers live
in `vercel.json`; do not add a catch-all rewrite, it would shadow the API route.

Set `GITHUB_TOKEN` as a server environment variable for Production and Preview. It is optional in the sense
that the function still works without one, but unauthenticated GitHub allows 60 requests per hour per IP and
Vercel functions share egress addresses, so a live site will hit the ceiling.

Canonical, Open Graph and Twitter tags, plus `robots.txt` and `sitemap.xml`, are generated at build time from
`VITE_SITE_URL`. Unset, it falls back to Vercel's own production URL. Set it once a domain is attached.
Preview deployments emit `Disallow: /`.
