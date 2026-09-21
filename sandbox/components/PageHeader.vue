<template>
  <div
    class="sandbox-header"
    :class="{ scrolling: scrollY > 7 }"
  >
    <div class="controls">
      <h1>
        <a
          class="home-link"
          href="https://github.com/Kong/icons"
          target="_blank"
          title="View on GitHub"
        >
          <KongIcon decorative />
          <span class="home-link-text">Kong Icons</span>
        </a>
      </h1>
      <KPop
        class="options-popover"
        hide-caret
        placement="bottom-end"
        :popover-timeout="0"
        width="320"
      >
        <KButton
          appearance="secondary"
          class="options-button"
        >
          <CogIcon decorative />
          <span class="options-text">Options</span>
        </KButton>

        <template #content>
          <div class="options-panel">
            <section class="options-section">
              <span class="section-title">Gradient</span>
              <label class="gradient-toggle">
                <input
                  v-model="gradientEnabled"
                  type="checkbox"
                >
                Add solid icon gradient
              </label>
              <template v-if="gradientEnabled">
                <div class="option-row">
                  <span class="option-label">Start</span>
                  <ColorField
                    v-model="gradientStart"
                    aria-label="Gradient start color"
                  />
                </div>
                <div class="option-row">
                  <span class="option-label">Stop</span>
                  <ColorField
                    v-model="gradientStop"
                    aria-label="Gradient stop color"
                  />
                </div>
                <div class="option-row">
                  <span class="option-label">Direction</span>
                  <KInput
                    v-model.trim="gradientDirection"
                    aria-label="Gradient direction"
                    class="direction"
                    placeholder="135deg"
                  />
                </div>
              </template>
            </section>
          </div>
        </template>
      </KPop>
      <div class="search">
        <KInput
          v-model.trim="query"
          aria-label="Search icons"
          class="search-input"
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
import { CogIcon, KongIcon, SearchIcon } from '../../src/components/solid'
import ColorField from './ColorField.vue'

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
$header-height: 48px;

.sandbox-header {
  align-items: center;
  background-color: $kui-color-background;
  border-bottom: $kui-border-width-10 solid $kui-color-border-neutral-weaker;
  display: flex;
  gap: $kui-space-50;
  height: $header-height;
  justify-content: space-between;
  left: 0;
  padding-inline: $kui-space-50;
  position: fixed;
  right: 0;
  top: 0;
  transition: box-shadow 0.3s ease;
  z-index: 1;

  @media (min-width: $kui-breakpoint-tablet) {
    gap: $kui-space-70;
    padding-inline: $kui-space-70;
  }

  .options-popover {
    margin-left: auto;
  }

  &.scrolling {
    box-shadow: $kui-shadow;
  }

  h1 {
    flex-shrink: 0;
    font-size: $kui-font-size-50;
    margin: $kui-space-0;

    @media (min-width: $kui-breakpoint-phablet) {
      font-size: $kui-font-size-70;
    }
  }
}

.home-link {
  align-items: center;
  color: $kui-color-text-primary-strong;
  display: flex;
  font-weight: $kui-font-weight-bold;
  gap: $kui-space-20;
  text-decoration: none;
  white-space: nowrap;

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

// Hide the brand wordmark on small phones so the icon logo stands alone
.home-link-text {
  display: none;

  @media (min-width: $kui-breakpoint-mobile) {
    display: inline;
  }
}

.controls {
  align-items: center;
  display: flex;
  flex: 1;
  gap: $kui-space-40;
  max-width: 100%;
  min-width: 0;
  width: 100%;

  @media (min-width: $kui-breakpoint-tablet) {
    gap: $kui-space-50;
  }
}

.options-button {
  white-space: nowrap;
}

// Collapse the Options button to an icon-only control on small phones
.options-text {
  display: none;

  @media (min-width: $kui-breakpoint-mobile) {
    display: inline;
  }
}

.options-panel {
  display: flex;
  flex-direction: column;
  gap: $kui-space-70;
}

.options-section {
  display: flex;
  flex-direction: column;
  gap: $kui-space-40;

  .section-title {
    color: $kui-color-text-neutral;
    font-size: $kui-font-size-20;
    font-weight: $kui-font-weight-semibold;
    text-transform: uppercase;
  }

  .direction {
    inline-size: 90px;
  }
}

.gradient-toggle {
  align-items: center;
  color: $kui-color-text;
  cursor: pointer;
  display: flex;
  font-size: $kui-font-size-30;
  gap: $kui-space-30;
}

.option-row {
  align-items: center;
  display: flex;
  gap: $kui-space-40;

  .option-label {
    color: $kui-color-text-neutral;
    font-size: $kui-font-size-30;
    inline-size: 64px;
  }
}

.search {
  flex: 1 1 auto;
  max-width: 300px;
  min-width: 0;
}

.search,
.search-input {
  max-width: 200px;
}

.search-input {

  :deep(input) {
    max-height: 36px;
  }
}
</style>
