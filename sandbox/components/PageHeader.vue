<template>
  <div
    class="sandbox-header"
    :class="{ scrolling: scrollY > 7 }"
  >
    <h1>
      <KExternalLink
        class="home-link"
        href="https://github.com/Kong/icons"
        title="View on GitHub"
      >
        <KongIcon decorative />
        Kong Icons
      </KExternalLink>
    </h1>
    <div class="controls">
      <div class="gradient-controls">
        <label class="gradient-toggle">
          <input
            v-model="gradientEnabled"
            type="checkbox"
          >
          Gradient
        </label>
        <template v-if="gradientEnabled">
          <input
            v-model="gradientStart"
            aria-label="Gradient start color"
            class="color-swatch"
            title="Gradient start color"
            type="color"
          >
          <input
            v-model="gradientStop"
            aria-label="Gradient stop color"
            class="color-swatch"
            title="Gradient stop color"
            type="color"
          >
          <KInput
            v-model.trim="gradientDirection"
            aria-label="Gradient direction"
            class="direction"
            placeholder="135deg"
          />
        </template>
      </div>
      <div class="search">
        <KInput
          v-model.trim="query"
          aria-label="Search icons"
          placeholder="Search icons"
          type="search"
        >
          <template #before>
            <SearchIcon decorative />
          </template>
        </KInput>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useWindowScroll, watchDebounced } from '@vueuse/core'
import { KongIcon, SearchIcon } from '../../src/components/solid'

const query = defineModel('search', {
  type: String,
  required: true,
})

/** Whether the live gradient preview is applied across every icon in the grid */
const gradientEnabled = defineModel('gradientEnabled', {
  type: Boolean,
  default: false,
})
/** The gradient start color applied to every icon while the preview is enabled */
const gradientStart = defineModel('gradientStart', {
  type: String,
  default: '#0044F4',
})
/** The gradient stop color applied to every icon while the preview is enabled */
const gradientStop = defineModel('gradientStop', {
  type: String,
  default: '#00D6A4',
})
/** The gradient direction (CSS angle) applied to every icon while the preview is enabled */
const gradientDirection = defineModel('gradientDirection', {
  type: String,
  default: '135deg',
})

const route = useRoute()
const router = useRouter()
const { y: scrollY } = useWindowScroll()

watchDebounced(query, (searchQuery) => {
  if (route.query?.q !== query.value) {
    router.replace({ name: 'home', query: { q: searchQuery || undefined } })
  }
}, {
  debounce: 200,
})

if (route.query.q) {
  query.value = String(route.query.q)
}
</script>

<style lang="scss" scoped>
$header-height: 80px;

.sandbox-header {
  align-items: center;
  background-color: $kui-color-background;
  border-bottom: $kui-border-width-10 solid $kui-color-border-neutral-weaker;
  display: inline-flex;
  height: $header-height;
  justify-content: space-between;
  left: 0;
  padding: $kui-space-70;
  position: fixed;
  right: 0;
  top: 0;
  transition: box-shadow 0.3s ease;
  width: 100%;
  z-index: 1;

  &.scrolling {
    box-shadow: $kui-shadow;
  }

  h1 {
    font-size: $kui-font-size-50;
    margin: $kui-space-0;

    @media (min-width: $kui-breakpoint-phablet) {
      font-size: $kui-font-size-70;
    }
  }
}

.home-link {
  color: $kui-color-text-primary-strong;
  display: flex;
  font-weight: $kui-font-weight-bold;
  gap: $kui-space-20;
  margin-right: $kui-space-70;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: $kui-border-width-10 solid $kui-color-text-primary;
  }

  &:hover {
    color: $kui-color-text-primary-stronger;
  }
}

.controls {
  align-items: center;
  display: flex;
  gap: $kui-space-50;
}

.gradient-controls {
  align-items: center;
  display: none;
  gap: $kui-space-40;

  @media (min-width: $kui-breakpoint-tablet) {
    display: flex;
  }

  .gradient-toggle {
    align-items: center;
    color: $kui-color-text;
    cursor: pointer;
    display: flex;
    font-size: $kui-font-size-30;
    font-weight: $kui-font-weight-medium;
    gap: $kui-space-20;
    white-space: nowrap;
  }

  .color-swatch {
    block-size: 32px;
    border: $kui-border-width-10 solid $kui-color-border-neutral-weaker;
    border-radius: $kui-border-radius-20;
    cursor: pointer;
    inline-size: 32px;
    padding: $kui-space-0;
  }

  .direction {
    inline-size: 90px;
  }
}

.search {
  max-width: 300px;
  width: 100%;
}
</style>
