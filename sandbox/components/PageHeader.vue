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
      <KPop
        hide-caret
        placement="bottom-end"
        :popover-timeout="0"
        width="320"
      >
        <KButton appearance="secondary">
          <CogIcon decorative />
          Options
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

            <section class="options-section">
              <span class="section-title">Icon types</span>
              <label
                v-for="item in typeItems"
                :key="item.value"
                class="type-checkbox"
              >
                <input
                  :checked="selectedTypes.includes(item.value)"
                  type="checkbox"
                  :value="item.value"
                  @change="toggleType(item.value)"
                >
                {{ item.label }}
              </label>
            </section>
          </div>
        </template>
      </KPop>
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
import { CogIcon, KongIcon, SearchIcon } from '../../src/components/solid'
import ColorField from './ColorField.vue'

/** The icon types available in the filter, in display order */
const typeItems = [
  { label: 'Solid', value: 'solid' },
  { label: 'Multi Color', value: 'multi-color' },
  { label: 'Flags', value: 'flags' },
]

const query = defineModel('search', {
  type: String,
  required: true,
})

/** The icon types currently shown in the grid (v-model array of type keys) */
const selectedTypes = defineModel<string[]>('selectedTypes', {
  default: () => ['solid', 'multi-color', 'flags'],
})

/** Add or remove an icon type from the filter, reassigning the array so the v-model update propagates */
const toggleType = (value: string) => {
  selectedTypes.value = selectedTypes.value.includes(value)
    ? selectedTypes.value.filter(type => type !== value)
    : [...selectedTypes.value, value]
}

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
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .direction {
    inline-size: 90px;
  }
}

.gradient-toggle,
.type-checkbox {
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
  max-width: 300px;
  width: 100%;
}
</style>
