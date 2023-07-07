<template>
  <component
    :is="iconComponent"
    v-if="iconName"
  />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import ComponentLoading from '../components/ComponentLoading.vue'
import ComponentError from '../components/ComponentError.vue'

const route = useRoute()
const iconName = computed((): string => route.params.icon as string)

const iconComponent = defineAsyncComponent({
  // the loader function
  loader: () => import(`../../src/components/${iconName.value}.vue`),
  loadingComponent: ComponentLoading,
  // A component to use if the load fails
  errorComponent: ComponentError,
  // The error component will be displayed if a timeout is provided and exceeded. Default: Infinity.
  timeout: 1500,
})
</script>
