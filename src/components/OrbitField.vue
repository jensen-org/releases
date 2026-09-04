<script setup lang="ts">
const RINGS = [
  { cx: 50, cy: 50, r: 27 },
  { cx: 50, cy: 50, r: 41 },
]
</script>

<template>
  <svg class="orbit-field" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <circle v-for="(ring, index) in RINGS" :key="index" class="orbit-line" :cx="ring.cx" :cy="ring.cy" :r="ring.r" />
  </svg>
</template>
