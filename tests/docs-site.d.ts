declare module '*/sidebar.mjs' {
  export const sidebar: { label: string; items: { label: string; slug: string }[] }[]
}

declare module '*/redirects.mjs' {
  export const redirects: Record<string, string>
}
