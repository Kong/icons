<template>
  <div class="sandbox-header">
    <router-link
      class="home-link"
      :to="{ name: 'home'}"
    >
      <h1>
        Kong Icons Sandbox
      </h1>
    </router-link>
    <div class="search">
      <input
        id="icon-filter"
        v-model="query"
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

  if (!query.value) {
    return allComponents
  }

  return allComponents.filter((icon: any) => icon.name.toLowerCase().includes(query.value))
})
</script>

<style lang="scss" scoped>
@import './../styles/sandbox-variables';

.sandbox-header {
  align-items: center;
  border-bottom: 1px solid lightgray;
  display: inline-flex;
  justify-content: space-between;
  padding: 20px;
  width: 100%;

  @media only screen and (min-width: $viewport-xl) {
    border: none;
  }

  h1 {
    font-size: 18px;
    margin: 0;

    @media only screen and (min-width: $viewport-md) {
      font-size: 24px;
    }
  }
}

.sandbox-layout {
  display: flex;
  padding: 20px;
}

.sandbox-container {
  min-height: 50vh;
  width: 100%;

  @media only screen and (min-width: $viewport-xl) {
    border: 1px solid lightgray;
    padding: 20px;
  }
}

.home-link {
  color: #000;
  text-decoration: none;
}

.search {
  input {
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: none;
    font-size: 14px;
    height: 40px;
    max-width: 200px;
    padding: 4px 8px;
    width: 100%;
  }
}

.icon-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-items: stretch;
}

p {
  font-size: 14px;
}
</style>
