import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

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
  integrations: [
    starlight({
      title: 'Jensen',
      description:
        'Documentation for Jensen, an AI-first IDE for large, complex codebases. Understand the codebase before you change it.',
      favicon: '/favicon.svg',
      customCss: ['./src/styles/jensen.css'],
      editLink: { baseUrl: 'https://github.com/jensen-org/releases/edit/main/docs-site/' },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/jensen-org/releases' },
      ],
      head: [
        { tag: 'meta', attrs: { name: 'theme-color', content: '#fbfbf9' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/releases/apple-touch-icon.png' } },
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://jensen-org.github.io/releases/og.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://jensen-org.github.io/releases/og.png' } },
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
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'What is Jensen', slug: 'start/what-is-jensen' },
            { label: 'Honest by design', slug: 'start/honest-by-design' },
            { label: 'Download and install', slug: 'start/download-and-install' },
            { label: 'Verify a download', slug: 'start/verify-a-download' },
            { label: 'First run', slug: 'start/first-run' },
            { label: 'Open a project', slug: 'start/open-a-project' },
          ],
        },
        {
          label: 'The app',
          items: [
            { label: 'Getting around', slug: 'app/getting-around' },
            { label: 'Project, the map', slug: 'app/project' },
            { label: 'Sessions', slug: 'app/sessions' },
            { label: 'Work', slug: 'app/work' },
            { label: 'Code', slug: 'app/code' },
          ],
        },
        {
          label: 'Working with AI',
          items: [
            { label: 'How Jensen works with your assistant', slug: 'ai/how-it-works' },
            { label: 'Choosing an assistant', slug: 'ai/choosing-an-assistant' },
            { label: 'The context server', slug: 'ai/context-server' },
            { label: 'What your assistant can do', slug: 'ai/what-your-assistant-can-do' },
            { label: 'Plans and objectives', slug: 'ai/plans-and-objectives' },
            { label: 'Agent hooks', slug: 'ai/agent-hooks' },
            { label: 'Agent profiles and workflows', slug: 'ai/profiles-and-workflows' },
            { label: 'Missions and schedules', slug: 'ai/missions-and-schedules' },
            { label: 'Trust, approvals and permissions', slug: 'ai/trust-approvals-and-permissions' },
            { label: 'Models and providers', slug: 'ai/models-and-providers' },
          ],
        },
        {
          label: 'Knowledge',
          items: [
            { label: 'Project context', slug: 'knowledge/project-context' },
            { label: 'Memory and knowledge search', slug: 'knowledge/memory-and-search' },
            { label: 'Skills', slug: 'knowledge/skills' },
          ],
        },
        {
          label: 'Safety and recovery',
          items: [
            { label: 'The git guard', slug: 'safety/git-guard' },
            { label: 'Findings and screening', slug: 'safety/findings-and-screening' },
            { label: 'Undo and the session trace', slug: 'safety/undo-and-the-session-trace' },
            { label: 'Worktrees for parallel work', slug: 'safety/worktrees' },
          ],
        },
        {
          label: 'Extending Jensen',
          items: [{ label: 'Plugins and themes', slug: 'extending/plugins-and-themes' }],
        },
        {
          label: 'Reference',
          items: [
            { label: 'CLI reference', slug: 'reference/cli' },
            { label: 'Settings reference', slug: 'reference/settings' },
            { label: 'Troubleshooting', slug: 'reference/troubleshooting' },
          ],
        },
        {
          label: 'About',
          items: [
            { label: 'Roadmap', slug: 'about/roadmap' },
            { label: 'License and security', slug: 'about/license-and-security' },
          ],
        },
      ],
    }),
  ],
})
