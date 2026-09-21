<template>
  <div class="color-field">
    <input
      :aria-label="`${ariaLabel} swatch`"
      class="color-swatch"
      :title="ariaLabel"
      type="color"
      :value="swatchHex"
      @input="onSwatchInput"
    >
    <KInput
      :aria-label="ariaLabel"
      class="color-input"
      :model-value="modelValue"
      placeholder="#0044F4"
      @update:model-value="onTextInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** The current color value; HEX is the primary format, with `rgb()`/`rgba()` supported as a secondary format */
  modelValue: string
  /** Accessible label describing which gradient stop this field controls */
  ariaLabel: string
}>()

const emit = defineEmits<{
  /** Emitted with the raw color string whenever the value changes */
  'update:modelValue': [value: string]
}>()

/** Clamp a channel to the 0-255 range and format it as a two-digit hex byte */
const toHexByte = (value: number): string =>
  Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')

/**
 * Convert the current value to a `#rrggbb` string for the native color swatch.
 * Accepts 3/6/8-digit HEX and `rgb()`/`rgba()`; falls back to black for values the
 * native swatch cannot represent (e.g. a CSS `var()`).
 */
const swatchHex = computed((): string => {
  const value = props.modelValue.trim()

  // 3-digit hex → expand to 6-digit
  const shortHex = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(value)
  if (shortHex) {
    return `#${shortHex[1]}${shortHex[1]}${shortHex[2]}${shortHex[2]}${shortHex[3]}${shortHex[3]}`
  }

  // 6-digit hex (optionally with a trailing alpha byte) → drop the alpha for the swatch
  const longHex = /^#([0-9a-f]{6})(?:[0-9a-f]{2})?$/i.exec(value)
  if (longHex) {
    return `#${longHex[1]}`
  }

  // rgb()/rgba() → #rrggbb
  const rgb = /^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/i.exec(value)
  if (rgb) {
    return `#${toHexByte(Number(rgb[1]))}${toHexByte(Number(rgb[2]))}${toHexByte(Number(rgb[3]))}`
  }

  return '#000000'
})

/** Forward a raw text value (HEX primary, `rgb()` secondary) exactly as typed */
const onTextInput = (value: string | number) => {
  emit('update:modelValue', String(value))
}

/** The native swatch always yields a `#rrggbb` HEX value */
const onSwatchInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style lang="scss" scoped>
.color-field {
  align-items: center;
  display: flex;
  gap: $kui-space-20;
}

.color-swatch {
  block-size: 32px;
  border: $kui-border-width-10 solid $kui-color-border-neutral-weaker;
  border-radius: $kui-border-radius-20;
  cursor: pointer;
  flex-shrink: 0;
  inline-size: 32px;
  padding: $kui-space-0;
}

.color-input {
  inline-size: 110px;
}
</style>
