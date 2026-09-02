<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SignalRing from './components/SignalRing.vue'

interface Build { version: string; publishedAt: string; byteSize: number; downloadUrl: string }
interface Release { status: 'available' | 'unavailable' | 'error'; builds?: Build[]; releaseUrl: string }

const RELEASES_URL = 'https://github.com/jensen-org/jensen-release/releases'

const release = ref<Release | null>(null)
const loading = ref(true)

const builds = computed(() => release.value?.builds ?? [])
const releasesUrl = computed(() => release.value?.releaseUrl ?? RELEASES_URL)

const notice = computed(() => {
  if (loading.value) return 'Checking latest release'
  if (release.value?.status === 'error') return 'Release information unavailable'
  return 'macOS build coming soon'
})

const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`
const formatDate = (value: string) => new Date(value).toISOString().slice(0, 10)

onMounted(async () => {
  try {
    const response = await fetch('/api/release')
    release.value = await response.json()
  } catch {
    release.value = { status: 'error', releaseUrl: RELEASES_URL }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page">
    <header class="brand">
      <img class="brand-mark" src="/jensen.png" alt="" width="54" height="54">
      <span class="brand-name">Jensen</span>
    </header>

    <main class="stage">
      <SignalRing />
    </main>

    <footer class="shelf">
      <Card class="shelf-card" :class="{ 'shelf-bare': !builds.length }">
        <template #title>
          <div class="shelf-head">
            <h1 class="shelf-title">Jensen for macOS</h1>
            <span class="shelf-arch">Apple Silicon</span>
          </div>
        </template>

        <template #content>
          <DataTable :value="builds" :loading="loading" data-key="version">
            <Column field="version" header="Version">
              <template #body="{ data, index }">
                <span class="cell-version">{{ data.version }}</span>
                <Tag v-if="index === 0" class="cell-tag" value="Latest" />
              </template>
            </Column>

            <Column field="byteSize" header="Size" class="cell-num">
              <template #body="{ data }">
                <span class="cell-fact">{{ formatSize(data.byteSize) }}</span>
              </template>
            </Column>

            <Column field="publishedAt" header="Published" class="cell-num">
              <template #body="{ data }">
                <span class="cell-fact">{{ formatDate(data.publishedAt) }}</span>
              </template>
            </Column>

            <Column class="cell-action">
              <template #body="{ data, index }">
                <Button v-slot="slotProps" as-child :outlined="index !== 0" size="small">
                  <a
                    :class="slotProps.class"
                    :href="data.downloadUrl"
                    :aria-label="`Download Jensen for macOS ${data.version}`"
                    download
                  >Download</a>
                </Button>
              </template>
            </Column>

            <template #empty>
              <div class="shelf-empty">
                <Message severity="secondary" variant="simple">{{ notice }}</Message>
                <a v-if="!loading" class="releases-link" :href="releasesUrl">View GitHub Releases</a>
              </div>
            </template>
          </DataTable>
        </template>
      </Card>
    </footer>
  </div>
</template>
