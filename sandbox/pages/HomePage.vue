<template>
  <PageHeader v-model:search="searchQuery" />
  <div class="sandbox-layout">
    <div class="sandbox-container">
      <template v-if="hasResults">
        <div
          v-for="(icons, type) in groupedComponents"
          :key="type"
          class="icon-container"
        >
          <h2>
            {{ formatType(type) }} Icons
            <span class="counts">
              ({{ icons.length }})
            </span>
          </h2>

          <div class="icon-grid">
            <SandboxIcon
              v-for="icon in icons"
              :key="icon.name"
              :icon="icon.component"
              :title="icon.title"
            />
          </div>
        </div>
      </template>

      <KEmptyState
        v-else
        message="No icons match your query. Try searching again."
        title="No Results Found."
      >
        <template #icon>
          <solidIcons.FileEmptyIcon decorative />
        </template>

        <template #action>
          <KButton @click="searchQuery = ''">
            Clear Search
          </KButton>
        </template>
      </KEmptyState>
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
import type { Country } from '../types'

const searchQuery = ref('')

// precompute country map once
const countryMap = new Map(COUNTRY_CODES.map((c: Country) => [c.code.toUpperCase(), c.name]))

const allComponents = computed(() => {
  const componentList = []

  const addIcons = (icons: Record<string, any>, type: string) => {
    for (const [name, component] of Object.entries(icons)) {
      componentList.push({ type, name, component, keywords: [], title: '' })
    }
  }

  addIcons(solidIcons, 'solid')
  addIcons(multiColorIcons, 'multi-color')

  for (const [key, component] of Object.entries(flagIcons)) {
    const match = /Flag(.*?)Icon/.exec(key)
    const code = match?.[1]?.toUpperCase()
    const countryName = code && countryMap.get(code)

    componentList.push({
      type: 'flags',
      name: key,
      component,
      keywords: countryName ? [countryName.toLowerCase()] : [],
      title: countryName || '',
    })
  }

  return componentList
})

const filteredComponents = computed(() => {
  const term = searchQuery.value.trim().toLowerCase().replace(/icon/gi, '')
  if (!term) return allComponents.value

  return allComponents.value.filter(icon =>
    icon.name.toLowerCase().includes(term) ||
    icon.keywords.some(k => k.includes(term)),
  )
})

const hasResults = computed(() => filteredComponents.value.length > 0)

// Group icons by type for easy rendering
const groupedComponents = computed(() => {
  const groups: Record<string, any[]> = {}
  for (const icon of filteredComponents.value) {
    if (!groups[icon.type]) groups[icon.type] = []
    groups[icon.type].push(icon)
  }
  return groups
})

// Helper for title formatting
const formatType = (type: string) => type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())
</script>

<style lang="scss" scoped>
$header-height: 80px;
$content-max-width: 1800px;

.sandbox-layout {
  display: flex;
  margin-top: $header-height;
  padding: $kui-space-70;
}

.sandbox-container {
  min-height: 50vh;
  width: 100%;

  @media (min-width: $kui-breakpoint-laptop) {
    padding: $kui-space-70;
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
  margin: $kui-space-0 auto $kui-space-50;
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

  .counts {
    font-size: $kui-font-size-40;
    font-weight: $kui-font-weight-regular;
  }
}
</style>
