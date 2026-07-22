<script lang="ts" setup>
/** {%%ICON_COMPONENT_FILE_HEADER%%} */
import { computed } from 'vue'
import { KUI_ICON_SIZE_50 } from '@kong/design-tokens'
import { applyColorGradient, createGradientId, resolveColorGradient } from '@/utils/color-gradient'
import type { ColorGradient } from '@/types/color-gradient'

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
      // Allow CSS custom-property expressions, e.g. var(--kui-icon-size-50, 24px)
      if (typeof sizeValue === 'string' && /^\s*var\(\s*--[\w-]+\s*(?:,[^)]*)?\)\s*$/.test(sizeValue)) {
        return true
      }

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
  /**
   * The start color of an optional, dynamically-generated linear gradient.
   * Accepts a hex, `rgb()`/`rgba()`, or CSS `var()` custom-property value.
   * The gradient is applied only when both `colorGradientStart` and `colorGradientStop` are provided and valid,
   * overriding any existing gradient or flat fills. Defaults to an empty string (no gradient).
   */
  colorGradientStart: {
    type: String,
    required: false,
    default: '',
  },
  /**
   * The stop (end) color of an optional, dynamically-generated linear gradient.
   * Accepts a hex, `rgb()`/`rgba()`, or CSS `var()` custom-property value.
   * The gradient is applied only when both `colorGradientStart` and `colorGradientStop` are provided and valid,
   * overriding any existing gradient or flat fills. Defaults to an empty string (no gradient).
   */
  colorGradientStop: {
    type: String,
    required: false,
    default: '',
  },
  /**
   * The direction of the generated linear gradient, expressed as a standard CSS gradient angle
   * (e.g. `45`, `"90deg"`) following the `linear-gradient()` convention (`0deg` points up, increasing clockwise).
   * Invalid values fall back to the default. Defaults to `135deg` (top-left to bottom-right).
   */
  colorGradientDirection: {
    type: [String, Number],
    required: false,
    default: '135deg',
  },
})

/** Returns true if the given value is a CSS `var()` custom-property expression, e.g. `var(--kui-icon-size-50, 24px)` */
const isCssVar = (value: unknown): value is string => typeof value === 'string' && /^\s*var\(\s*--[\w-]+\s*(?:,[^)]*)?\)\s*$/.test(value)

const iconSize = computed((): string => {
  // If props.size is a CSS variable expression, return it as-is
  if (isCssVar(props.size)) {
    return props.size as string
  }

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
const rootElementStyles = computed((): Record<string, string | undefined> => ({
  boxSizing: 'border-box',
  color: props.color,
  display: props.display,
  flexShrink: '0',
  height: iconSize.value,
  lineHeight: '0',
  width: iconSize.value,
  pointerEvents: props.decorative ? 'none' : undefined,
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

const htmlEntities: { [key: string]: string } = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '&': '&amp;',
}
const escapeHtml = (str: string) => {
  return str.replace(/[<>"'&]/g, (match) => htmlEntities[match])
}

/** The top-level `/svg/*` subdirectory this icon was generated from: `solid`, `multi-color`, or `flags`. */
const iconType: string = '{%%KONG_COMPONENT_ICON_TYPE%%}'

/**
 * A stable, unique `id` for this icon instance's generated `<linearGradient>` so that multiple gradient
 * icons can coexist on the same page. Uses a stable id under `staticIds` (e.g. for snapshot testing).
 */
const gradientId = createGradientId(props.staticIds)

/**
 * The validated gradient to apply, or `null` when the feature is unused or the provided colors are invalid.
 * Emits a dev console warning when a gradient is attempted with missing/invalid colors.
 */
const colorGradient = computed((): ColorGradient | null => {
  const start = typeof props.colorGradientStart === 'string' ? props.colorGradientStart.trim() : ''
  const stop = typeof props.colorGradientStop === 'string' ? props.colorGradientStop.trim() : ''

  // The feature is opt-in: do nothing unless at least one gradient color was provided
  if (!start && !stop) {
    return null
  }

  // Gradients are never applied to flag icons, which must retain their official colors
  if (iconType === 'flags') {
    return null
  }

  const gradient = resolveColorGradient({
    id: gradientId,
    start,
    stop,
    direction: props.colorGradientDirection,
  })

  // Both colors are required and must be valid; otherwise fall back to the un-gradiented icon
  if (!gradient) {
    console.warn(`[kong-icons] Ignoring invalid linear gradient: both \`colorGradientStart\` and \`colorGradientStop\` must be a valid hex, rgb()/rgba(), or var() color. Received start="${props.colorGradientStart}", stop="${props.colorGradientStop}".`)
    return null
  }

  return gradient
})

// The `svgOriginalContent` template string will be replaced with the SVG innerHTML in the generate script.
// eslint-disable-next-line @stylistic/quotes
const svgOriginalContent = `{%%ICON_SVG_INNER_HTML%%}`

/** The fully-processed SVG inner HTML: optional title, optional gradient, and (unless `staticIds`) uniquely-prefixed IDs. */
const svgProcessedContent = computed((): string => {
  const titleContent = props.title ? `<title data-testid="kui-icon-svg-title">${escapeHtml(props.title)}</title>` : ''
  const gradient = colorGradient.value
  const content = gradient ? applyColorGradient(svgOriginalContent, gradient) : svgOriginalContent
  const processed = props.staticIds ? content : prefixSvgIdsInString(content)

  return `${titleContent}${processed}`
})
</script>

<template>
  <component
    :is="as"
    :aria-hidden="decorative ? 'true' : undefined"
    class="kui-icon {%%KONG_COMPONENT_ICON_CLASS%%}"
    data-testid="kui-icon-wrapper-{%%KONG_COMPONENT_ICON_CLASS%%}"
    :style="rootElementStyles"
    :tabindex="decorative ? '-1' : undefined"
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
