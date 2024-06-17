<template>
  <PageHeader @search="(query: string) => searchQuery = query" />
  <div class="sandbox-layout">
    <div class="sandbox-container">
      <div v-if="filteredComponents.length">
        <!-- Solid Icons -->
        <div
          v-if="filteredComponents.filter((icon) => icon.type === 'solid').length"
          class="icon-container"
        >
          <h2>Solid Icons</h2>
          <div class="icon-grid">
            <SandboxIcon
              v-for="(icon, idx) in filteredComponents.filter((icon) => icon.type === 'solid')"
              :key="`icon-${idx}`"
              :icon="icon.component"
            />
          </div>
        </div>
        <!-- Multi-Color Icons -->
        <div
          v-if="filteredComponents.filter((icon) => icon.type === 'multi-color').length"
          class="icon-container"
        >
          <h2>Multi-Color Icons</h2>
          <div class="icon-grid">
            <SandboxIcon
              v-for="(icon, idx) in filteredComponents.filter((icon) => icon.type === 'multi-color')"
              :key="`icon-${idx}`"
              :icon="icon.component"
            />
          </div>
        </div>
        <!-- Flag Icons -->
        <div
          v-if="filteredComponents.filter((icon) => icon.type === 'flags').length"
          class="icon-container"
        >
          <h2>Flag Icons</h2>
          <div class="icon-grid">
            <SandboxIcon
              v-for="(icon, idx) in filteredComponents.filter((icon) => icon.type === 'flags')"
              :key="`icon-${idx}`"
              :icon="icon.component"
            />
          </div>
        </div>
      </div>
      <p v-else>
        No icons match your query. Try searching again.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import SandboxIcon from '../components/SandboxIcon.vue'
import * as solidIcons from '../../src/components/solid'
import * as multiColorIcons from '../../src/components/multi-color'
import * as flagIcons from '../../src/components/flags'
import { COUNTRY_CODES } from '../constants/countries'

interface Country {
  code: string
  name: string
}

const searchQuery = ref('')

const filteredComponents = computed(() => {
  const allComponents = []

  // solid icons
  for (const [key, val] of Object.entries(solidIcons)) {
    allComponents.push({
      type: 'solid',
      name: key,
      component: val,
      keywords: [],
    })
  }

  // multi-color icons
  for (const [key, val] of Object.entries(multiColorIcons)) {
    allComponents.push({
      type: 'multi-color',
      name: key,
      component: val,
      keywords: [],
    })
  }

  // flags
  for (const [key, val] of Object.entries(flagIcons)) {
    // Create a map of 2 letter code to country name
    const countryMap: Map<string, { name: string }> = COUNTRY_CODES.reduce((
      map: Map<string, { name: string }>,
      country: Country,
    ) => map.set(country.code, { name: country.name }), new Map())

    // Grab 2-letter country code from icon name
    const match = /Flag(.*?)Icon/.exec(key) || ''
    const countryCode = match[1].toUpperCase()

    allComponents.push({
      type: 'flags',
      name: key,
      component: val,
      keywords: countryMap.has(countryCode) ? [countryMap.get(countryCode)?.name.toLowerCase()] : [],
    })
  }

  if (!searchQuery.value || searchQuery.value?.toLowerCase() === 'icon') {
    return allComponents
  }

  const searchTerm = searchQuery.value.toLowerCase().replace(/icon/gi, '')

  return allComponents.filter((icon: any) => {
    return icon.name.toLowerCase().includes(searchTerm) || icon?.keywords.some((country: string) => country.includes(searchTerm))
  })
})
</script>

<style lang="scss" scoped>
$header-height: 80px;
$content-max-width: 1800px;

.sandbox-layout {
  display: flex;
  margin-top: $header-height;
  padding: 20px;
}

.sandbox-container {
  min-height: 50vh;
  width: 100%;

  @media (min-width: $kui-breakpoint-laptop) {
    padding: 20px;
  }
}

.icon-container {
  border-bottom: $kui-border-width-10 solid $kui-color-border;
  margin-bottom: $kui-space-70;

  &:first-of-type {
    padding-top: $kui-space-0;
  }

  &:last-of-type {
    border-bottom: none;
    margin-bottom: $kui-space-0;
  }
}

.icon-grid {
  display: grid;
  gap: $kui-space-50;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0 auto $kui-space-50;
  max-width: $content-max-width;
  padding-bottom: $kui-space-70;
  width: 100%;

  @media (min-width: $kui-breakpoint-mobile) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: $kui-breakpoint-tablet) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (min-width: $kui-breakpoint-laptop) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  @media (min-width: $kui-breakpoint-desktop) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

h2 {
  color: $kui-color-text;
  margin-top: $kui-space-0;
}

p {
  font-size: 14px;
}
</style>
