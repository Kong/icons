<template>
  <PageHeader @search="(query: string) => searchQuery = query" />
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
import PageHeader from '../components/PageHeader.vue'
import SandboxIcon from '../components/SandboxIcon.vue'
import * as iconComponents from '../../src/components'

const searchQuery = ref('')
const filteredComponents = computed(() => {
  const allComponents = []

  for (const [key, val] of Object.entries(iconComponents)) {
    allComponents.push({
      name: key,
      component: val,
    })
  }

  if (!searchQuery.value || searchQuery.value?.toLowerCase() === 'icon') {
    return allComponents
  }

  return allComponents.filter((icon: any) => icon.name.toLowerCase().includes(searchQuery.value.toLowerCase().replace(/icon/gi, '')))
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
