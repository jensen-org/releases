<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import QueryGraph from './components/QueryGraph.vue'
import { MOBILE_QUERY, detectPlatform, isMobileDevice } from './lib/platform'
import type { Build, Format, Platform } from '../api/release'

interface Release { status: 'available' | 'unavailable' | 'error'; builds?: Build[] }

const RELEASES_URL = 'https://github.com/jensen-org/releases/releases'
const DOCS_URL = 'https://jensen-org.github.io/releases/'
const LICENSE_URL = 'https://github.com/jensen-org/releases/blob/main/LICENSE.md'

const TABS: { id: Platform; label: string; arch: string; formats: Format[] }[] = [
  { id: 'macos', label: 'macOS', arch: 'Apple Silicon', formats: ['dmg'] },
  { id: 'linux', label: 'Linux', arch: 'x86_64', formats: ['deb', 'rpm'] },
]

const mobile = ref(isMobileDevice())
const release = ref<Release | null>(null)
const loading = ref(true)
const platform = ref<Platform>(detectPlatform())
const tabEls = ref<HTMLButtonElement[]>([])

function reachTab(event: KeyboardEvent, index: number) {
  const steps: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: TABS.length - 1 }
  const step = steps[event.key]
  if (step === undefined) return
  event.preventDefault()
  const next = (step + TABS.length) % TABS.length
  platform.value = TABS[next].id
  tabEls.value[next]?.focus()
}

const tab = computed(() => TABS.find((entry) => entry.id === platform.value) ?? TABS[0])

const offered = computed(() => (release.value?.builds ?? []).filter((build) => build.platform === platform.value))

const primary = computed(() => {
  const newest = offered.value.filter((build) => build.version === offered.value[0]?.version)
  for (const format of tab.value.formats) {
    const build = newest.find((entry) => entry.format === format)
    if (build) return build
  }
  return newest[0] ?? null
})

const alternate = computed(() => {
  const lead = primary.value
  if (!lead) return null
  return offered.value.find((build) => build.format !== lead.format && build.version === lead.version) ?? null
})

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`
const formatDate = (value: string) => new Date(value).toISOString().slice(0, 10)

const action = computed(() => `Download for ${tab.value.label}`)

const label = computed(() => {
  const build = primary.value
  if (!build) return action.value
  return `Download Jensen for ${tab.value.label} ${build.version}${platform.value === 'linux' ? `, .${build.format} package` : ''}`
})

const version = computed(() => release.value?.builds?.[0]?.version.replace(/^v/i, '') ?? null)

const summary = computed(() => {
  const build = primary.value
  if (build) {
    const parts = [build.version, ...(platform.value === 'linux' ? [`.${build.format}`] : []), formatSize(build.byteSize), formatDate(build.publishedAt)]
    return parts.join(' · ')
  }
  if (loading.value) return 'Checking latest release'
  if (release.value?.status === 'error') return 'Release information unavailable'
  return `${tab.value.label} build coming soon`
})

let mobileQuery: MediaQueryList | undefined
const syncMobile = () => { mobile.value = isMobileDevice() }

onBeforeUnmount(() => mobileQuery?.removeEventListener('change', syncMobile))

onMounted(async () => {
  if (typeof window.matchMedia === 'function') {
    mobileQuery = window.matchMedia(MOBILE_QUERY)
    mobileQuery.addEventListener('change', syncMobile)
  }
  if (mobile.value) {
    loading.value = false
    return
  }
  try {
    const response = await fetch('/api/release')
    release.value = await response.json()
  } catch {
    release.value = { status: 'error' }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page">
    <header class="masthead">
      <div class="brand">
        <span class="brand-tile">
          <img src="/jensen.png" alt="" width="295" height="295">
        </span>
        <span class="brand-name">Jensen</span>
      </div>

      <nav class="nav" aria-label="Primary">
        <a class="nav-link" :href="RELEASES_URL">GitHub releases</a>
        <a class="nav-docs" :href="DOCS_URL">Documentation</a>
      </nav>
    </header>

    <main class="hero">
      <div class="hero-copy">
        <h1 class="hero-headline">An AI-first IDE for large, complex codebases</h1>

        <p class="hero-sub">
          Jensen integrates with your codebase and cuts the cognitive debt. Less to hold in your
          head, less for your agents to guess.
        </p>

        <section v-if="mobile" class="mobile-note" aria-label="Mobile">
          <span class="mobile-label">Mobile</span>
          <p class="mobile-message">Wow mobile version? maybe later ;)</p>
        </section>

        <div v-else class="shelf">
          <div class="shelf-head">
            <div class="shelf-tabs" role="tablist" aria-label="Platform">
              <button
                v-for="(entry, index) in TABS"
                :id="`tab-${entry.id}`"
                :key="entry.id"
                :ref="(el) => { if (el) tabEls[index] = el as HTMLButtonElement }"
                class="shelf-tab"
                type="button"
                role="tab"
                :aria-selected="platform === entry.id"
                :aria-controls="`panel-${entry.id}`"
                :tabindex="platform === entry.id ? 0 : -1"
                @click="platform = entry.id"
                @keydown="reachTab($event, index)"
              >
                {{ entry.label }}
              </button>
            </div>

            <span class="shelf-arch">{{ tab.arch }}</span>
          </div>

          <div :id="`panel-${platform}`" class="shelf-body" role="tabpanel" :aria-labelledby="`tab-${platform}`">
            <a v-if="primary" class="cta" :href="primary.downloadUrl" :aria-label="label" download>
              {{ action }}<span class="cta-arrow" aria-hidden="true">↓</span>
            </a>
            <button v-else class="cta" type="button" disabled>
              {{ action }}<span class="cta-arrow" aria-hidden="true">↓</span>
            </button>

            <div class="shelf-facts">
              <p class="shelf-summary">{{ summary }}</p>
              <span class="shelf-links">
                <a v-if="alternate" class="releases-link" :href="alternate.downloadUrl" download>.{{ alternate.format }} package</a>
                <a class="releases-link" :href="RELEASES_URL">View GitHub Releases ↗</a>
              </span>
            </div>
          </div>
        </div>
      </div>

      <QueryGraph />
    </main>

    <footer class="baseline">
      <span class="baseline-status">
        <span class="baseline-dot" aria-hidden="true" />
        {{ version ? `Beta ${version}` : 'Beta' }}
      </span>
      <a class="baseline-learn" :href="DOCS_URL">Learn more <span aria-hidden="true">↗</span></a>
      <a class="baseline-legal" :href="LICENSE_URL">Jensen EULA 1.0</a>
    </footer>
  </div>
</template>
