<script lang="ts" setup>
/**
{%%KONG_ICONS_COMPONENT_FILE_HEADER%%}
 */
defineProps({
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
</script>

<template>
  <span class="kui-icon">
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
.kui-icon {
  box-sizing: border-box;
  color: currentColor;
  display: block;
  height: $kui-font-size-60;
  line-height: 0;
  width: $kui-font-size-60;
}
</style>
