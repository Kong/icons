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
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useWindowScroll, watchDebounced } from '@vueuse/core'
import { KongIcon, SearchIcon } from '../../src/components/solid'

const query = defineModel('search', {
  type: String,
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

.search {
  max-width: 300px;
  width: 100%;
}
</style>
