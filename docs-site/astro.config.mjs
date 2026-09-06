import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import starlightLinksValidator from 'starlight-links-validator'
import { sidebar } from './src/sidebar.mjs'
import { redirects } from './src/redirects.mjs'

const ink = {
  paper: '#fbfbf9',
  ink: '#0e0e0d',
  lift: '#2e2e29',
  graphite: '#56564f',
  haze: '#a8a8a0',
  edge: '#e4e4de',
}

const shade = {
  paper: '#040406',
  ink: '#f1f1f2',
  lift: '#d1d1d6',
  graphite: '#a9a9b0',
  haze: '#57575f',
  edge: '#1b1b21',
}

const monochrome = (name, type, c) => ({
  name,
  type,
  colors: {
    'editor.background': c.paper,
    'editor.foreground': c.lift,
    'editorLineNumber.foreground': c.haze,
    'editor.selectionBackground': c.edge,
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: c.haze, fontStyle: 'italic' } },
    { scope: ['punctuation', 'meta.brace', 'punctuation.separator'], settings: { foreground: c.haze } },
    { scope: ['string', 'string.quoted', 'constant.other.symbol'], settings: { foreground: c.graphite } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character.escape'], settings: { foreground: c.graphite } },
    { scope: ['keyword', 'storage', 'storage.type', 'keyword.operator', 'keyword.control'], settings: { foreground: c.ink, fontStyle: 'bold' } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: c.ink } },
    { scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'], settings: { foreground: c.ink } },
    { scope: ['entity.name.tag', 'meta.tag'], settings: { foreground: c.ink } },
    { scope: ['variable', 'variable.other', 'meta.object-literal.key', 'entity.other.attribute-name'], settings: { foreground: c.lift } },
    { scope: ['markup.heading'], settings: { foreground: c.ink, fontStyle: 'bold' } },
    { scope: ['markup.inserted'], settings: { foreground: c.ink } },
    { scope: ['markup.deleted'], settings: { foreground: c.graphite } },
  ],
})

export default defineConfig({
  site: 'https://jensen-org.github.io',
  base: '/releases',
  trailingSlash: 'always',
  redirects,
  integrations: [
    starlight({
      title: 'Jensen',
      plugins: [starlightLinksValidator({ errorOnRelativeLinks: false })],
      sidebar,
      description:
        'Documentation for Jensen, an AI-first IDE for large, complex codebases. Understand the codebase before you change it.',
      favicon: '/favicon.svg',
      logo: { src: './src/assets/jensen.png' },
      customCss: ['./src/styles/jensen.css'],
      components: { Hero: './src/components/Hero.astro' },
      editLink: { baseUrl: 'https://github.com/jensen-org/releases/edit/main/docs-site/' },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/jensen-org/releases' },
      ],
      head: [
        { tag: 'meta', attrs: { name: 'theme-color', content: '#fbfbf9' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/releases/apple-touch-icon.png' } },
      ],
      expressiveCode: {
        themes: [monochrome('jensen-dark', 'dark', shade), monochrome('jensen-light', 'light', ink)],
        styleOverrides: {
          borderColor: 'var(--sl-color-hairline)',
          borderRadius: '2px',
          codeFontFamily: 'var(--sl-font-mono)',
          frames: {
            shadowColor: 'transparent',
            frameBoxShadowCssValue: 'none',
            editorBackground: 'var(--sl-color-bg)',
            editorTabBarBackground: 'var(--sl-color-bg)',
            editorTabBarBorderBottomColor: 'var(--sl-color-hairline)',
            editorActiveTabBackground: 'var(--sl-color-bg)',
            editorActiveTabForeground: 'var(--sl-color-white)',
            editorActiveTabBorderColor: 'var(--sl-color-hairline)',
            editorActiveTabIndicatorTopColor: 'var(--sl-color-white)',
            editorActiveTabIndicatorBottomColor: 'transparent',
            terminalBackground: 'var(--sl-color-bg)',
            terminalTitlebarBackground: 'var(--sl-color-bg)',
            terminalTitlebarForeground: 'var(--sl-color-gray-3)',
            terminalTitlebarBorderBottomColor: 'var(--sl-color-hairline)',
            terminalTitlebarDotsForeground: 'var(--sl-color-gray-5)',
            terminalTitlebarDotsOpacity: '1',
            inlineButtonBackground: 'transparent',
            inlineButtonBorder: 'var(--sl-color-hairline)',
            inlineButtonForeground: 'var(--sl-color-gray-2)',
            tooltipSuccessBackground: 'var(--sl-color-bg-accent)',
            tooltipSuccessForeground: 'var(--sl-color-text-invert)',
          },
        },
      },
    }),
  ],
})
