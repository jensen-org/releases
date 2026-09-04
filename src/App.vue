<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import DiffusionVeil from './components/DiffusionVeil.vue'
import OrbitField from './components/OrbitField.vue'
import SignalRing from './components/SignalRing.vue'
import { attachMagnet } from './lib/magnetic'
import { detectPlatform } from './lib/platform'
import type { Build, Format, Platform } from '../api/release'

interface Release { status: 'available' | 'unavailable' | 'error'; builds?: Build[] }

const RELEASES_URL = 'https://github.com/jensen-org/releases/releases'
const DOCS_URL = 'https://jensen-org.github.io/releases/'
const LICENSE_URL = 'https://github.com/jensen-org/releases/blob/main/LICENSE.md'
const APPLE_GLYPH = 'M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C61.8 141.2 12 184.5 12 272.3c0 25.9 4.7 52.7 14.2 80.3 12.6 36.4 58.1 125.7 105.6 124.2 24.8-.6 42.4-17.6 74.7-17.6 31.3 0 47.6 17.6 75.3 17.6 47.9-.7 89.1-81.8 101.1-118.3-64.3-30.3-64.2-88.9-64.2-90.7zm-56.4-165.4c27.2-32.3 24.7-61.7 23.9-72.3-24 1.4-51.8 16.4-67.6 34.9-17.4 19.8-27.6 44.3-25.4 71.9 25.9 2 49.6-11.3 69.1-34.5z'
const CUBE_GLYPH = 'M8 1.4 14.2 4.7v6.6L8 14.6 1.8 11.3V4.7zM1.8 4.7 8 8.05l6.2-3.35M8 8.05v6.55'

const TABS: { id: Platform; label: string; arch: string; formats: Format[] }[] = [
  { id: 'macos', label: 'macOS', arch: 'Apple Silicon', formats: ['dmg'] },
  { id: 'linux', label: 'Linux', arch: 'x86_64', formats: ['deb', 'rpm'] },
]

const release = ref<Release | null>(null)
const loading = ref(true)
const platform = ref<Platform>('macos')
const downloadEl = ref<HTMLElement | null>(null)

const tab = computed(() => TABS.find((entry) => entry.id === platform.value) ?? TABS[0])

const offered = computed(() => (release.value?.builds ?? []).filter((build) => build.platform === platform.value))

const primary = computed(() => {
  for (const format of tab.value.formats) {
    const build = offered.value.find((entry) => entry.format === format)
    if (build) return build
  }
  return null
})

const alternate = computed(() => {
  const lead = primary.value
  if (!lead) return null
  return offered.value.find((build) => build.format !== lead.format && build.version === lead.version) ?? null
})

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`
const formatDate = (value: string) => new Date(value).toISOString().slice(0, 10)

const action = computed(() => {
  if (platform.value === 'macos') return 'Download for macOS'
  return primary.value ? `Download .${primary.value.format}` : 'Download for Linux'
})

const label = computed(() => {
  const build = primary.value
  if (!build) return action.value
  return `Download Jensen for ${tab.value.label} ${build.version}${platform.value === 'linux' ? `, .${build.format} package` : ''}`
})

const summary = computed(() => {
  const build = primary.value
  if (build) return `${build.version} · ${formatSize(build.byteSize)} · ${formatDate(build.publishedAt)}`
  if (loading.value) return 'Checking latest release'
  if (release.value?.status === 'error') return 'Release information unavailable'
  return `${tab.value.label} build coming soon`
})

let releaseMagnet: (() => void) | undefined

watch(downloadEl, (element) => {
  releaseMagnet?.()
  releaseMagnet = element ? attachMagnet(element) : undefined
})

onMounted(async () => {
  platform.value = detectPlatform()
  try {
    const response = await fetch('/api/release')
    release.value = await response.json()
  } catch {
    release.value = { status: 'error' }
  } finally {
    loading.value = false
  }
})

onUnmounted(() => releaseMagnet?.())
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
    </header>

    <main class="hero">
      <div class="hero-copy">
        <h1 class="hero-headline"><span>An AI-first IDE for large,</span> <span>complex codebases</span></h1>

        <p class="hero-sub">
          Jensen integrates with your codebase and cuts the cognitive debt. Less to hold in your
          head, less for your agents to guess.
        </p>

        <a class="hero-learn" :href="DOCS_URL">
          Learn more
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.3" /></svg>
        </a>

        <span class="hero-rule" />

        <Card class="shelf-card">
          <template #title>
            <div class="shelf-head">
              <h2 id="shelf-title" class="shelf-title">Download Jensen</h2>

              <div class="shelf-tabs" role="tablist" aria-labelledby="shelf-title">
                <button
                  v-for="entry in TABS"
                  :id="`tab-${entry.id}`"
                  :key="entry.id"
                  class="shelf-tab"
                  type="button"
                  role="tab"
                  :aria-selected="platform === entry.id"
                  :aria-controls="`panel-${entry.id}`"
                  :tabindex="platform === entry.id ? 0 : -1"
                  @click="platform = entry.id"
                >
                  {{ entry.label }}
                </button>
              </div>

              <span class="shelf-arch">{{ tab.arch }}</span>
            </div>
          </template>

          <template #content>
            <div :id="`panel-${platform}`" class="shelf-body" role="tabpanel" :aria-labelledby="`tab-${platform}`">
              <Button v-if="primary" v-slot="slotProps" as-child>
                <a
                  ref="downloadEl"
                  :class="slotProps.class"
                  :href="primary.downloadUrl"
                  :aria-label="label"
                  download
                >
                  <svg v-if="platform === 'macos'" class="glyph" viewBox="0 0 384 512" aria-hidden="true" focusable="false"><path :d="APPLE_GLYPH" /></svg>
                  <svg v-else class="glyph glyph-line" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path :d="CUBE_GLYPH" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" /></svg>
                  {{ action }}
                </a>
              </Button>

              <Button v-else disabled>
                <svg v-if="platform === 'macos'" class="glyph" viewBox="0 0 384 512" aria-hidden="true" focusable="false"><path :d="APPLE_GLYPH" /></svg>
                <svg v-else class="glyph glyph-line" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path :d="CUBE_GLYPH" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" /></svg>
                {{ action }}
              </Button>

              <div class="shelf-facts">
                <p class="shelf-summary">{{ summary }}</p>
                <span class="shelf-links">
                  <a v-if="alternate" class="releases-link" :href="alternate.downloadUrl" download>.{{ alternate.format }} package</a>
                  <a class="releases-link" :href="RELEASES_URL">View GitHub Releases</a>
                </span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="ring">
        <OrbitField />
        <SignalRing />
      </div>
    </main>

    <footer class="baseline">
      <span class="baseline-status">
        <span class="baseline-dot" aria-hidden="true" />
        Beta 0.1.0
      </span>
      <a class="baseline-legal" :href="LICENSE_URL">Jensen EULA 1.0</a>
    </footer>

    <DiffusionVeil />
  </div>
</template>
