<script lang="ts" setup>
/** {%%KONG_ICONS_COMPONENT_FILE_HEADER%%} */
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: '',
  },
  decorative: {
    type: Boolean,
    required: false,
    default: false,
  },
  size: {
    type: Number,
    required: false,
    default: 24, // TODO: Replace with a token
  },
})

/**
 * For now, we are adding styles inline to avoid additional stylesheet imports in the host application/component.
 * This _does_ make it harder to override styles; however, all of the properties can/will be mapped to component props for customization.
 */
const rootElementStyles = computed((): Record<string, string> => ({
  boxSizing: 'border-box',
  color: 'currentColor',
  display: 'block',
  height: `${props.size}px`,
  lineHeight: '0',
  width: `${props.size}px`,
}))
</script>

<template>
  <span :style="rootElementStyles">
    <svg
      :aria-hidden="decorative ? true : false"
      aria-labelledby="theTitle"
      fill="none"
      :height="String(size)"
      role="img"
      viewBox="0 0 24 24"
      :width="String(size)"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title v-if="title">{{ title }}</title>
      <path
        clipRule="evenodd"
        d="{%%KONG_ICONS_SVG_PATH%%}"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  </span>
</template>

<style lang="scss" scoped>
/**
 * For now, we are adding styles inline to avoid additional stylesheet imports in the host application/component.
 * Do not add styles into this component file.
 */
</style>
