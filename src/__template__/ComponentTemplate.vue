<script lang="ts" setup>
/** {%%ICON_COMPONENT_FILE_HEADER%%} */
import { computed } from 'vue'
import { KUI_ICON_SIZE_50 } from '@kong/design-tokens'

const props = defineProps({
  /** The accessibility text provided to screen readers */
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
    type: [Number, String],
    required: false,
    default: 24, // KUI_ICON_SIZE_50
    validator: (sizeValue: number): boolean => {
      if (typeof sizeValue === 'number' && sizeValue > 0) {
        return true
      }

      if (typeof sizeValue === 'string') {
        const sizeNumber = Number(sizeValue)
        return Number.isInteger(sizeNumber) && sizeNumber > 0
      }

      return false
    },
  },
  /** The HTML tag to utilize for the icon's wrapper element. Defaults to `span` */
  tag: {
    type: String,
    required: false,
    default: 'span',
  },
})

const iconSize = computed((): string => {
  // If props.size is a number, ensure it's greater than zero
  if (typeof props.size === 'number' && props.size > 0) {
    return `${props.size}px`
  }

  const sizeNumber = Number(props.size)
  // If props.size is a string, ensure the string converts 1:1 to a number, and ensure it's greater than zero
  if (typeof props.size === 'string' && sizeNumber && Number.isInteger(sizeNumber) && sizeNumber > 0) {
    return `${props.size}px`
  }

  // Return the default icon size
  return KUI_ICON_SIZE_50
})

/**
 * We are adding styles inline to avoid additional stylesheet imports in the host application/component.
 * All of the properties should be mapped to component props for customization.
 */
const rootElementStyles = computed((): Record<string, string> => ({
  boxSizing: 'border-box',
  color: props.color,
  display: props.display,
  height: iconSize.value,
  lineHeight: '0',
  width: iconSize.value,
}))
</script>

<template>
  <component
    :is="tag"
    :aria-hidden="decorative ? 'true' : undefined"
    class="kui-icon {%%KONG_COMPONENT_ICON_CLASS%%}"
    data-testid="kui-icon-wrapper-{%%KONG_COMPONENT_ICON_CLASS%%}"
    :style="rootElementStyles"
  >
    <svg
      :aria-hidden="decorative ? 'true' : undefined"
      data-testid="kui-icon-svg-{%%KONG_COMPONENT_ICON_CLASS%%}"
      fill="none"
      height="100%"
      role="img"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title
        v-if="title"
        data-testid="kui-icon-svg-title"
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
