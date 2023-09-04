<template>
  <div class="sandbox-header">
    <h1>
      <a
        class="home-link"
        href="https://github.com/Kong/icons"
        target="_blank"
        title="View on GitHub"
      >Kong Icons
        <component
          :is="iconComponents.ExternalLinkIcon"
          as="span"
          display="inline-block"
          :size="16"
        />
      </a>
    </h1>
    <div class="search">
      <input
        v-model.trim="query"
        placeholder="Search icons"
        type="search"
      >
    </div>
  </div>
  <div class="sandbox-layout">
    <div class="sandbox-container">
      <div
        v-if="filteredComponents.length"
        class="icon-container"
      >
        <SandboxIcon
          v-for="(icon, idx) in filteredComponents"
          :key="`icon-${idx}`"
          :icon="icon.component"
        />
      </div>
      <p v-else>
        No icons match your query. Try searching again.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SandboxIcon from '../components/SandboxIcon.vue'
import * as iconComponents from '../../src/components'

const query = ref('')
const filteredComponents = computed(() => {
  const allComponents = []

  for (const [key, val] of Object.entries(iconComponents)) {
    allComponents.push({
      name: key,
      component: val,
    })
  }

  if (!query.value || query.value?.toLowerCase() === 'icon') {
    return allComponents
  }

  return allComponents.filter((icon: any) => icon.name.toLowerCase().includes(query.value.toLowerCase().replace(/icon/gi, '')))
})
</script>

<style lang="scss" scoped>
$header-height: 80px;
$content-max-width: 1800px;

.sandbox-header {
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid lightgray;
  box-shadow: 0 0 8px rgba(0, 0, 0, .25);
  display: inline-flex;
  height: $header-height;
  justify-content: space-between;
  left: 0;
  padding: 20px;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;

  h1 {
    font-size: 18px;
    margin: 0;

    @media (min-width: $kui-breakpoint-phablet) {
      font-size: 24px;
    }
  }
}

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

.home-link {
  color: $kui-color-text-primary-strong;
  margin-right: $kui-space-70;
  outline: none;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  white-space: nowrap;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 1px solid $kui-color-text-primary;
  }

  &:hover {
    color: $kui-color-text-primary-stronger;
  }
}

.search {
  max-width: 300px;
  width: 100%;

  input {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: none;
    font-size: 16px;
    height: 40px;
    padding: 4px 8px;
    width: 100%;
  }
}

.icon-container {
  display: grid;
  gap: $kui-space-50;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0 auto;
  max-width: $content-max-width;
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

p {
  font-size: 14px;
}
</style>
