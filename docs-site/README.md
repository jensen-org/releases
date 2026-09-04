# Jensen documentation

The public documentation site, served at <https://jensen-org.github.io/releases/>.

```bash
bun install
bun run dev        # http://localhost:4321/releases/
bun run build
bun run preview
bunx astro check
```

Astro and Starlight, with its own `package.json` and lockfile so the repository root install stays
untouched. `site` and `base` are pinned to the GitHub Pages URL, so every internal link resolves
under `/releases`.

Deployed by `.github/workflows/docs.yml` on any push to `main` that touches this directory. The
repository's Pages source must be set to **GitHub Actions**.

`src/styles/jensen.css` maps the download page's palette onto Starlight's tokens. Starlight is
dark-first, so bare `:root` carries the dark values and `:root[data-theme='light']` the light ones.
Fonts live in `src/fonts/` and are self-hosted; nothing loads from a third-party origin.

Content is public documentation for a product whose source is not in this repository. Describe what a
reader invokes, never how the product is built.
