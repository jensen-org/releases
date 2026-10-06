# Jensen documentation

The public documentation site, served at <https://docs.jensen-ide.com/>.

```bash
bun install
bun run dev        # http://localhost:4321/
bun run build
bun run preview
bunx astro check
```

Astro and Starlight, with its own `package.json` and lockfile so the repository root install stays
untouched. `site` is `https://docs.jensen-ide.com` and there is no `base`, so every internal link is
absolute, such as `/flow/plans/`. `errorOnRelativeLinks` is on, so a relative link fails the build.

Deployed by `.github/workflows/docs.yml` on any push to `main` that touches this directory.

`src/styles/jensen.css` maps the download page's palette onto Starlight's tokens. Starlight is
dark-first, so bare `:root` carries the dark values and `:root[data-theme='light']` the light ones.
Fonts live in `src/fonts/` and are self-hosted. Nothing loads from a third-party origin.

## Writing

Describe what a reader does in the app: a page, a pane, a button. Show the matching `jensen` command in
a `:::tip[From the terminal]` aside. That aside is reserved for terminal commands.

Write plainly. Use short active sentences and cut filler words. Use commas, not dashes, as separators.
`tests/docs-voice.test.ts` fails on filler words and dashes.

Content is public documentation for a product whose source is not in this repository. Describe what a
reader invokes, never how the product is built.
