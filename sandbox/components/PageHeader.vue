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
    <div class="header-actions">
      <KInputSwitch
        v-model="darkMode"
        class="dark-mode-toggle"
        label="Dark mode"
      />
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
const darkMode = defineModel('darkMode', {
  type: Boolean,
  required: true,
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
  background-color: var(--kui-color-background, $kui-color-background);
  border-bottom: var(--kui-border-width-10, $kui-border-width-10) solid var(--kui-color-border-neutral-weaker, $kui-color-border-neutral-weaker);
  display: inline-flex;
  height: $header-height;
  justify-content: space-between;
  left: 0;
  padding: var(--kui-space-70, $kui-space-70);
  position: fixed;
  right: 0;
  top: 0;
  transition: box-shadow 0.3s ease;
  width: 100%;
  z-index: 1;

  &.scrolling {
    box-shadow: var(--kui-shadow, $kui-shadow);
  }

  h1 {
    font-size: var(--kui-font-size-50, $kui-font-size-50);
    margin: var(--kui-space-0, $kui-space-0);

    @media (min-width: $kui-breakpoint-phablet) {
      font-size: var(--kui-font-size-70, $kui-font-size-70);
    }
  }
}

.home-link {
  color: var(--kui-color-text-primary-strong, $kui-color-text-primary-strong);
  display: flex;
  font-weight: var(--kui-font-weight-bold, $kui-font-weight-bold);
  gap: var(--kui-space-20, $kui-space-20);
  margin-right: var(--kui-space-70, $kui-space-70);

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: var(--kui-border-width-10, $kui-border-width-10) solid var(--kui-color-text-primary, $kui-color-text-primary);
  }

  &:hover {
    color: var(--kui-color-text-primary-stronger, $kui-color-text-primary-stronger);
  }
}

.header-actions {
  align-items: center;
  display: flex;
  flex: 1;
  gap: var(--kui-space-50, $kui-space-50);
  justify-content: flex-end;
  margin-left: auto;
}

.search {
  flex: 1;
  max-width: 300px;
  width: 100%;
}

.dark-mode-toggle {
  flex-shrink: 0;
}
</style>
