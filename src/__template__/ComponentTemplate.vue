<script lang="ts" setup>
/** {%%ICON_COMPONENT_FILE_HEADER%%} */
import { computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
  /** The SVG accessible name element */
  title: {
    type: String,
    required: false,
    default: '',
  },
  /** The icon color. Defaults to `currentColor` which inherits text color from the parent element */
  color: {
    type: String,
    required: false,
    default: 'currentColor',
  },
  /** The CSS display property for the icon. Defaults to `block` */
  display: {
    type: String,
    required: false,
    default: 'block',
  },
  /** Whether the icon is just eye-candy or is meaningful to the page (should screen-readers ignore the icon?) */
  decorative: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** The icon size */
  size: {
    type: Number,
    required: false,
    default: 24, // TODO: Replace with a token
    validator: (sizeValue: number): boolean => typeof sizeValue === 'number' && sizeValue > 0,
  },
  /** The HTML tag to utilize for the icon's wrapper element. Defaults to `span` */
  tag: {
    type: String,
    required: false,
    default: 'span',
  },
})

/**
 * We are adding styles inline to avoid additional stylesheet imports in the host application/component.
 * All of the properties should be mapped to component props for customization.
 */
const rootElementStyles = computed((): Record<string, string> => ({
  boxSizing: 'border-box',
  color: props.color,
  display: props.display,
  height: `${props.size}px`,
  lineHeight: '0',
  width: `${props.size}px`,
}))

// Compute a unique ID for the title element for a11y
const titleId = computed((): string => `{%%KONG_COMPONENT_ICON_CLASS%%}-${uuidv4()}`)
</script>

<template>
  <component
    :is="tag"
    class="kui-icon {%%KONG_COMPONENT_ICON_CLASS%%}"
    data-testid="kui-icon-wrapper-{%%KONG_COMPONENT_ICON_CLASS%%}"
    :style="rootElementStyles"
  >
    <svg
      :aria-hidden="decorative ? 'true' : undefined"
      :aria-labelledby="title ? titleId : undefined"
      data-testid="kui-icon-svg-{%%KONG_COMPONENT_ICON_CLASS%%}"
      fill="none"
      :height="size"
      role="img"
      viewBox="0 0 24 24"
      :width="size"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title
        v-if="title"
        :id="titleId"
      >{{ title }}</title>
      {%%ICON_SVG_INNER_HTML%%}
    </svg>
  </component>
</template>

<style lang="scss" scoped>
/**
 * We are adding styles inline to avoid additional stylesheet imports in the host application/component.
 * Do not add styles into this component file.
 */
</style>
