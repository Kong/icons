<template>
  <span class="sandbox-icon">
    <component
      :is="icon"
      :size="60"
      :title="iconName"
    />
    <span class="icon-name">{{ iconName }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: Object,
    required: true,
  },
})

const iconName = computed((): string => props.icon?.__name || '')
</script>

<style lang="scss" scoped>
.sandbox-icon {
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #0044f4;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px 8px;
}

.icon-name {
  color: #333;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  margin-top: 12px;
  padding: 2px 4px;
}
</style>
