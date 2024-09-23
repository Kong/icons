<script lang="ts" setup>
/** {%%ICON_COMPONENT_FILE_HEADER%%} */
import { computed, ref, onMounted } from 'vue'
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
  /** A boolean to enable prefixing any internal SVG ids with a unique string; useful when there are potentially multiple SVG instances on the same page and the SVG utilizes ids and references internally (e.g. in the `<defs>` tag).
   * Typically only set to false during snapshot testing.
   * Defaults to `true`.
   */
  randomizeIds: {
    type: Boolean,
    default: true,
  },
})

const svgElement = ref<SVGElement | null>(null)

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
 * Prefix all ids within the SVG element and update all corresponding references to these ids. This is useful to avoid id conflicts when utilizing multiple instances of the same SVG in the DOM.
 *
 * @param {SVGElement} svgElement - The SVG element whose potential IDs need to be prefixed.
 */
const prefixSvgIds = (svgElement: SVGElement): void => {
  if (!svgElement) {
    return
  }

  const defsElement = svgElement.querySelector('defs')

  // Prepare a map to store the original and new IDs for quick lookups
  const idMap: Record<string, string> = {}

  if (defsElement) {
    // Prefix all direct children of <defs> that have an `id`
    defsElement.querySelectorAll('[id]').forEach((element) => {
      const originalId = element.getAttribute('id')
      const newId = `${Math.random().toString(36).substring(2, 12)}-${originalId}`

      // Map old id to new id
      idMap[originalId!] = newId

      // Update the element's id with the new prefixed id
      element.setAttribute('id', newId)
    })
  }

  // Update all references to these prefixed ids in attributes like `url(#id)`, `href`, `xlink:href`
  const referencingAttributes = ['fill', 'stroke', 'filter', 'mask', 'clip-path', 'xlink:href', 'href']

  // Function to update references to ids in attributes
  const updateReferences = (element: Element): void => {
    referencingAttributes.forEach((attr) => {
      const attrValue = element.getAttribute(attr)
      if (attrValue) {
        // Match any url(#id) or href="#id" references
        const updatedValue = attrValue.replace(/url\(#([^)]+)\)/g, (match, id) => {
          return idMap[id] ? `url(#${idMap[id]})` : match
        }).replace(/#([^\s]+)/g, (match, id) => {
          return idMap[id] ? `#${idMap[id]}` : match
        })

        // If the value changed, update the attribute
        if (updatedValue !== attrValue) {
          element.setAttribute(attr, updatedValue)
        }
      }
    })
  }

  // Traverse all elements in the SVG to update id references
  svgElement.querySelectorAll('*').forEach((element) => {
    updateReferences(element)
  })
}

onMounted(() => {
  if (props.randomizeIds && svgElement.value) {
    prefixSvgIds(svgElement.value)
  }
})
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
      ref="svgElement"
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
      >
        {{ title }}
      </title>
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
