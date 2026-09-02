const asks = (query: string) => typeof window.matchMedia === 'function' && window.matchMedia(query).matches

export const prefersReducedMotion = () => asks('(prefers-reduced-motion: reduce)')

export const hasCoarsePointer = () => asks('(pointer: coarse)')
