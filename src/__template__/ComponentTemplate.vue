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
    default: KUI_ICON_SIZE_50, // if setting to the imported const fails, just pass a number of 24 as the default.
    validator: (sizeValue: number | string): boolean => {
      if (typeof sizeValue === 'number' && sizeValue > 0) {
        return true
      }

      if (typeof sizeValue === 'string') {
        // Strip `px` from the string
        const sanitizedSize = String(sizeValue).replace(/px/gi, '')
        const sizeNumber = Number(sanitizedSize)
        if (sizeNumber && !isNaN(sizeNumber) && Number.isInteger(sizeNumber) && sizeNumber > 0) {
          return true
        }
      }

      return false
    },
  },
  /** The HTML tag to utilize for the icon's wrapper element. Defaults to `span` */
  as: {
    type: String,
    required: false,
    default: 'span',
  },
  /**
   * A boolean to disable prefixing any internal SVG ids with a unique string which is done to resolve the potential for multiple SVG instances on the same page and the SVG utilizing the same ids and references internally (e.g. in the `<defs>` tag).
   * Typically only set to `true` during snapshot testing.
   * Defaults to `false`.
   */
  staticIds: {
    type: Boolean,
    default: false,
  },
})

const iconSize = computed((): string => {
  // If props.size is a number, ensure it's greater than zero
  if (typeof props.size === 'number' && props.size > 0) {
    return `${props.size}px`
  }

  if (typeof props.size === 'string') {
    // Strip `px` from the string
    const sanitizedSize = String(props.size).replace(/px/gi, '')
    const sizeNumber = Number(sanitizedSize)
    if (sizeNumber && !isNaN(sizeNumber) && Number.isInteger(sizeNumber) && sizeNumber > 0) {
      return `${sizeNumber}px`
    }
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
  flexShrink: '0',
  height: iconSize.value,
  lineHeight: '0',
  width: iconSize.value,
}))

/**
 * Prefix all SVG IDs in the given SVG string with a random prefix to ensure uniqueness.
 *
 * This function performs the following steps:
 * 1. Generates a random prefix.
 * 2. Replaces all `id` attributes in the SVG string with the new prefixed IDs.
 * 3. Updates all ID references (e.g., `url(#id)`, `href="#id"`, etc.) to use the new prefixed IDs.
 *
 * @param {string} svgString - The SVG string in which to prefix IDs.
 * @returns {string} - The SVG string with prefixed IDs.
 */
const prefixSvgIdsInString = (svgString: string): string => {
  const idMap: Record<string, string> = {}
  const randomPrefix = Math.random().toString(36).substring(2, 12)

  // Replace IDs in the SVG string
  const updatedSvgString = svgString.replace(/id="([^"]+)"/g, (match, originalId) => {
    const newId = `${randomPrefix}-${originalId}`
    idMap[originalId] = newId
    return `id="${newId}"`
  })

  // Replace ID references (e.g., url(#id), href="#id", etc.)
  const processedSvgString = updatedSvgString.replace(/#([^\s^")]+)/g, (match, originalId) => idMap[originalId] ? `#${idMap[originalId]}` : match)

  // Return the processed SVG string
  return processedSvgString
}

// The `svgOriginalContent` template string will be replaced with the SVG innerHTML in the generate script.
// eslint-disable-next-line @stylistic/quotes
const svgOriginalContent = `{%%ICON_SVG_INNER_HTML%%}`
const svgTitleContent = props.title ? `<title data-testid="kui-icon-svg-title">${props.title}</title>` : ''
const svgProcessedContent = `${svgTitleContent}${!props.staticIds ? prefixSvgIdsInString(svgOriginalContent) : svgOriginalContent}`
</script>

<template>
  <component
    :is="as"
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
      v-html="svgProcessedContent"
    />
  </component>
</template>

<style>
/**
 * !Important: Do not add styles into this component file.
 *
 * We are adding styles inline to avoid additional stylesheet imports in the consuming application/component.
 */
</style>
