<template>
  <PageHeader
    v-model:gradient-direction="gradientDirection"
    v-model:gradient-enabled="gradientEnabled"
    v-model:gradient-start="gradientStart"
    v-model:gradient-stop="gradientStop"
    v-model:search="searchQuery"
  />
  <div class="sandbox-layout">
    <aside
      v-if="hasResults"
      class="sidebar"
    >
      <nav class="sidebar-nav">
        <button
          v-for="type in visibleTypes"
          :key="type"
          class="sidebar-link"
          :class="{ active: activeType === type }"
          type="button"
          @click="scrollToSection(type)"
        >
          <span>{{ formatType(type) }}</span>
          <span class="counts">{{ groupedComponents[type].length }}</span>
        </button>
      </nav>
    </aside>

    <div class="sandbox-container">
      <template v-if="hasResults">
        <section
          v-for="type in visibleTypes"
          :id="`section-${type}`"
          :key="type"
          class="icon-card"
        >
          <h2>
            {{ formatType(type) }} Icons
            <span class="counts">
              ({{ groupedComponents[type].length }})
            </span>
          </h2>

          <div class="icon-grid">
            <SandboxIcon
              v-for="icon in groupedComponents[type]"
              :key="icon.name"
              :gradient="gradientProps"
              :icon="icon.component"
              :title="icon.title"
            />
          </div>
        </section>
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
          <KButton @click="clearSearch">
            Clear Search
          </KButton>
        </template>
      </KEmptyState>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useEventListener, useThrottleFn } from '@vueuse/core'
import PageHeader from '../components/PageHeader.vue'
import SandboxIcon from '../components/SandboxIcon.vue'
import * as solidIcons from '../../src/components/solid'
import * as multiColorIcons from '../../src/components/multi-color'
import * as flagIcons from '../../src/components/flags'
import { COUNTRY_CODES } from '../constants/countries'
import type { Country } from '../types'

/** The icon types, in display order */
const ICON_TYPES = ['solid', 'multi-color', 'flags'] as const
type IconType = typeof ICON_TYPES[number]

/** localStorage key used to persist the sandbox's gradient preview options */
const STORAGE_KEY = 'kong-icons-sandbox-options'

/**
 * The gradient options that persist across reloads.
 */
interface SandboxOptions {
  /** Whether the gradient preview is applied across every icon */
  gradientEnabled: boolean
  /** The gradient start color (hex or rgb()) */
  gradientStart: string
  /** The gradient stop color (hex or rgb()) */
  gradientStop: string
  /** The gradient direction as a CSS angle (e.g. `135deg`) */
  gradientDirection: string
}

/** The default gradient options used when nothing valid is stored */
const defaultOptions = (): SandboxOptions => ({
  gradientEnabled: false,
  gradientStart: '#0044F4',
  gradientStop: '#00D6A4',
  gradientDirection: '135deg',
})

/** Read and validate persisted gradient options from localStorage, falling back to defaults */
const loadOptions = (): SandboxOptions => {
  const defaults = defaultOptions()

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaults
    }

    const parsed = JSON.parse(raw) as Partial<SandboxOptions>

    return {
      gradientEnabled: typeof parsed.gradientEnabled === 'boolean' ? parsed.gradientEnabled : defaults.gradientEnabled,
      gradientStart: typeof parsed.gradientStart === 'string' ? parsed.gradientStart : defaults.gradientStart,
      gradientStop: typeof parsed.gradientStop === 'string' ? parsed.gradientStop : defaults.gradientStop,
      gradientDirection: typeof parsed.gradientDirection === 'string' ? parsed.gradientDirection : defaults.gradientDirection,
    }
  } catch {
    // Ignore malformed JSON or unavailable storage and fall back to defaults
    return defaults
  }
}

const storedOptions = loadOptions()

const searchQuery = ref('')

// Live gradient preview state, applied across every icon in the grid
const gradientEnabled = ref(storedOptions.gradientEnabled)
const gradientStart = ref(storedOptions.gradientStart)
const gradientStop = ref(storedOptions.gradientStop)
const gradientDirection = ref(storedOptions.gradientDirection)

// Persist the gradient options whenever any of them change, so they survive a reload
watch([gradientEnabled, gradientStart, gradientStop, gradientDirection], () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      gradientEnabled: gradientEnabled.value,
      gradientStart: gradientStart.value,
      gradientStop: gradientStop.value,
      gradientDirection: gradientDirection.value,
    } satisfies SandboxOptions))
  } catch {
    // Ignore storage write failures (e.g. private mode / quota)
  }
})

/** The gradient props forwarded to every icon, or an empty object when the preview is disabled */
const gradientProps = computed((): Record<string, string> => gradientEnabled.value
  ? {
    colorGradientStart: gradientStart.value,
    colorGradientStop: gradientStop.value,
    colorGradientDirection: gradientDirection.value,
  }
  : {})

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

// Icons matching the search term
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

// The icon types that currently have results, in canonical order (drives the sidebar and sections)
const visibleTypes = computed<IconType[]>(() =>
  ICON_TYPES.filter(type => groupedComponents.value[type]?.length),
)

/** Clear the search term */
const clearSearch = () => {
  searchQuery.value = ''
}

// Helper for title formatting
const formatType = (type: string) => type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())

// --- Section navigation & scroll spy ---

// The fixed header height plus a little breathing room, used to offset anchor scrolling and scroll spy
const SCROLL_OFFSET = 100

// The section currently highlighted in the sidebar
const activeType = ref<IconType | undefined>(ICON_TYPES[0])

/** Resolve a section's DOM element by its icon type */
const sectionEl = (type: string): HTMLElement | null => document.getElementById(`section-${type}`)

/** Smooth-scroll a section into view and mark it active */
const scrollToSection = (type: IconType) => {
  activeType.value = type
  sectionEl(type)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Highlight the section nearest the top of the viewport as the user scrolls */
const updateActiveType = () => {
  let current = visibleTypes.value[0]
  for (const type of visibleTypes.value) {
    const el = sectionEl(type)
    if (el && el.getBoundingClientRect().top - SCROLL_OFFSET <= 1) {
      current = type
    }
  }
  if (current) {
    activeType.value = current
  }
}

useEventListener(window, 'scroll', useThrottleFn(updateActiveType, 100))

// When the search results change the set of visible sections, reset the active section
watch(visibleTypes, (types) => {
  if (!activeType.value || !types.includes(activeType.value)) {
    activeType.value = types[0]
  }
})
</script>

<style lang="scss" scoped>
$header-height: 48px;
$content-max-width: 1800px;
$sidebar-width: 200px;

.sandbox-layout {
  display: flex;
  flex-direction: column;
  gap: $kui-space-70;
  margin-top: $header-height;
  padding: $kui-space-50;

  @media (min-width: $kui-breakpoint-tablet) {
    padding: $kui-space-70;
  }

  @media (min-width: $kui-breakpoint-laptop) {
    flex-direction: row;
  }
}

.sidebar {
  flex-shrink: 0;

  @media (min-width: $kui-breakpoint-laptop) {
    align-self: flex-start;
    inline-size: $sidebar-width;
    position: sticky;
    top: calc(#{$header-height} + #{$kui-space-50});
  }
}

.sidebar-nav {
  display: flex;
  gap: $kui-space-20;
  overflow-x: auto;
  padding-bottom: $kui-space-20;

  @media (min-width: $kui-breakpoint-laptop) {
    flex-direction: column;
    overflow-x: visible;
    padding-bottom: $kui-space-0;
  }
}

.sidebar-link {
  align-items: center;
  background-color: transparent;
  border: none;
  border-radius: $kui-border-radius-30;
  color: $kui-color-text-neutral;
  cursor: pointer;
  display: flex;
  font-size: $kui-font-size-30;
  font-weight: $kui-font-weight-medium;
  gap: $kui-space-40;
  padding: $kui-space-40 $kui-space-50;
  white-space: nowrap;

  @media (min-width: $kui-breakpoint-laptop) {
    inline-size: 100%;
    justify-content: space-between;
  }

  &:hover {
    background-color: $kui-color-background-neutral-weakest;
    color: $kui-color-text;
  }

  &.active {
    background-color: $kui-color-background-primary-weakest;
    color: $kui-color-text-primary;
  }

  .counts {
    font-size: $kui-font-size-20;
    font-weight: $kui-font-weight-regular;
  }
}

.sandbox-container {
  flex: 1;
  min-height: 50vh;
  min-width: 0;
}

.icon-card {
  background-color: $kui-color-background;
  border: $kui-border-width-10 solid $kui-color-border;
  border-radius: $kui-border-radius-40;
  box-shadow: $kui-shadow;
  margin-bottom: $kui-space-70;
  padding: $kui-space-50;
  scroll-margin-top: calc(#{$header-height} + #{$kui-space-50});

  @media (min-width: $kui-breakpoint-tablet) {
    padding: $kui-space-70;
  }

  &:last-child {
    margin-bottom: $kui-space-0;
  }
}

.icon-grid {
  display: grid;
  gap: $kui-space-50;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: $kui-space-0 auto;
  max-width: $content-max-width;
  width: 100%;

  @media (min-width: $kui-breakpoint-mobile) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: $kui-breakpoint-tablet) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (min-width: $kui-breakpoint-laptop) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (min-width: $kui-breakpoint-desktop) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

h2 {
  color: $kui-color-text;
  margin-block: $kui-space-0 $kui-space-60;

  .counts {
    font-size: $kui-font-size-40;
    font-weight: $kui-font-weight-regular;
  }
}
</style>
