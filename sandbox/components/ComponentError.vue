<template>
  <p>No component named <code>{{ iconName }}</code> could be found.</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const iconName = computed((): string => route.params.icon as string)
</script>

<style lang="scss">
code {
  background: #eee;
  border-radius: 4px;
  color: #007ac1;
  font-family: monospace;
  font-size: 16px;
  padding: 2px 4px;
}
</style>
