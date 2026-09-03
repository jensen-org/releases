<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import DiffusionVeil from './components/DiffusionVeil.vue'
import SignalRing from './components/SignalRing.vue'
import { attachMagnet } from './lib/magnetic'

interface Build { version: string; publishedAt: string; byteSize: number; downloadUrl: string }
interface Release { status: 'available' | 'unavailable' | 'error'; builds?: Build[] }

const RELEASES_URL = 'https://github.com/jensen-org/jensen-release/releases'
const PROJECT_URL = 'https://github.com/jensen-org/jensen'
const LICENSE_URL = 'https://polyformproject.org/licenses/noncommercial/1.0.0/'
const APPLE_GLYPH = 'M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C61.8 141.2 12 184.5 12 272.3c0 25.9 4.7 52.7 14.2 80.3 12.6 36.4 58.1 125.7 105.6 124.2 24.8-.6 42.4-17.6 74.7-17.6 31.3 0 47.6 17.6 75.3 17.6 47.9-.7 89.1-81.8 101.1-118.3-64.3-30.3-64.2-88.9-64.2-90.7zm-56.4-165.4c27.2-32.3 24.7-61.7 23.9-72.3-24 1.4-51.8 16.4-67.6 34.9-17.4 19.8-27.6 44.3-25.4 71.9 25.9 2 49.6-11.3 69.1-34.5z'

const release = ref<Release | null>(null)
const loading = ref(true)
const downloadEl = ref<HTMLElement | null>(null)

const latest = computed(() => release.value?.builds?.[0] ?? null)

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`
const formatDate = (value: string) => new Date(value).toISOString().slice(0, 10)

const summary = computed(() => {
  const build = latest.value
  if (build) return `${build.version} · ${formatSize(build.byteSize)} · ${formatDate(build.publishedAt)}`
  if (loading.value) return 'Checking latest release'
  if (release.value?.status === 'error') return 'Release information unavailable'
  return 'macOS build coming soon'
})

let releaseMagnet: (() => void) | undefined

watch(downloadEl, (element) => {
  releaseMagnet?.()
  releaseMagnet = element ? attachMagnet(element) : undefined
})

onMounted(async () => {
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

        <a class="hero-learn" :href="PROJECT_URL">
          Learn more
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.3" /></svg>
        </a>

        <span class="hero-rule" />

        <Card class="shelf-card">
          <template #title>
            <div class="shelf-head">
              <h2 class="shelf-title">Jensen for macOS</h2>
              <span class="shelf-arch">Apple Silicon</span>
            </div>
          </template>

          <template #content>
            <div class="shelf-body">
              <Button v-if="latest" v-slot="slotProps" as-child>
                <a
                  ref="downloadEl"
                  :class="slotProps.class"
                  :href="latest.downloadUrl"
                  :aria-label="`Download Jensen for macOS ${latest.version}`"
                  download
                >
                  <svg class="glyph" viewBox="0 0 384 512" aria-hidden="true" focusable="false"><path :d="APPLE_GLYPH" /></svg>
                  Download for macOS
                </a>
              </Button>

              <Button v-else disabled>
                <svg class="glyph" viewBox="0 0 384 512" aria-hidden="true" focusable="false"><path :d="APPLE_GLYPH" /></svg>
                Download for macOS
              </Button>

              <div class="shelf-facts">
                <p class="shelf-summary">{{ summary }}</p>
                <a class="releases-link" :href="RELEASES_URL">View GitHub Releases</a>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="ring">
        <SignalRing />
      </div>
    </main>

    <footer class="baseline">
      <span class="baseline-status">
        <span class="baseline-dot" aria-hidden="true" />
        Beta 0.1.0
      </span>
      <a class="baseline-legal" :href="LICENSE_URL">PolyForm Noncommercial 1.0.0</a>
    </footer>

    <DiffusionVeil />
  </div>
</template>
