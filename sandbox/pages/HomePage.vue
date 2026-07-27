<template>
  <PageHeader
    v-model:gradient-direction="gradientDirection"
    v-model:gradient-enabled="gradientEnabled"
    v-model:gradient-start="gradientStart"
    v-model:gradient-stop="gradientStop"
    v-model:search="searchQuery"
    v-model:selected-types="selectedTypes"
  />
  <div class="sandbox-layout">
    <div class="sandbox-container">
      <template v-if="hasResults">
        <div
          v-for="(icons, type) in groupedComponents"
          :key="type"
          class="icon-container"
        >
          <button
            :aria-expanded="expandedTypes[type]"
            class="group-toggle"
            type="button"
            @click="expandedTypes[type] = !expandedTypes[type]"
          >
            <ChevronDownIcon
              class="group-chevron"
              :class="{ collapsed: !expandedTypes[type] }"
              decorative
              :size="20"
            />
            <h2>
              {{ formatType(type) }} Icons
              <span class="counts">
                ({{ icons.length }})
              </span>
            </h2>
          </button>

          <div
            v-show="expandedTypes[type]"
            class="icon-grid"
          >
            <SandboxIcon
              v-for="icon in icons"
              :key="icon.name"
              :gradient="gradientProps"
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
          <KButton @click="resetFilters">
            Clear Filters
          </KButton>
        </template>
      </KEmptyState>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import SandboxIcon from '../components/SandboxIcon.vue'
import * as solidIcons from '../../src/components/solid'
import * as multiColorIcons from '../../src/components/multi-color'
import * as flagIcons from '../../src/components/flags'
import { ChevronDownIcon } from '../../src/components/solid'
import { COUNTRY_CODES } from '../constants/countries'
import type { Country } from '../types'

/** The icon types available to filter by, in display order */
const ICON_TYPES = ['solid', 'multi-color', 'flags'] as const
type IconType = typeof ICON_TYPES[number]

/** localStorage key used to persist the sandbox's gradient preview options */
const STORAGE_KEY = 'kong-icons-sandbox-options'

/**
 * The gradient options that persist across reloads. The icon-type filter is intentionally
 * excluded — it always resets to showing every type on load.
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

// Icon-type filter (v-model bound to the PageHeader options popover). Not persisted:
// always resets to showing every type on load.
const selectedTypes = ref<IconType[]>([...ICON_TYPES])
// Per-type collapse state: all groups expanded by default
const expandedTypes = reactive<Record<IconType, boolean>>({
  'solid': true,
  'multi-color': true,
  'flags': true,
})

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

// Icons matching the search term (before the icon-type filter is applied)
const searchedComponents = computed(() => {
  const term = searchQuery.value.trim().toLowerCase().replace(/icon/gi, '')
  if (!term) return allComponents.value

  return allComponents.value.filter(icon =>
    icon.name.toLowerCase().includes(term) ||
    icon.keywords.some(k => k.includes(term)),
  )
})

// Icons matching both the search term and the selected icon types
const filteredComponents = computed(() =>
  searchedComponents.value.filter(icon => selectedTypes.value.includes(icon.type as IconType)),
)

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

/** Reset both the search term and the icon-type filter to their defaults */
const resetFilters = () => {
  searchQuery.value = ''
  selectedTypes.value = [...ICON_TYPES]
}

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

.group-toggle {
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  gap: $kui-space-30;
  padding: $kui-space-0;
  text-align: left;
  width: 100%;

  // Reset heading margins so the chevron aligns to the text's vertical center
  h2 {
    margin: $kui-space-0;
  }

  .group-chevron {
    color: $kui-color-text-neutral;
    display: block;
    flex-shrink: 0;
    transition: transform 0.2s ease;

    &.collapsed {
      transform: rotate(-90deg);
    }
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
