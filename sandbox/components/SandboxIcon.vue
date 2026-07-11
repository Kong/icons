<template>
  <div class="sandbox-icon">
    <div class="actions-container">
      <KClipboardProvider v-slot="{ copyToClipboard }">
        <KTooltip
          placement="bottom-end"
          :popover-timeout="300"
          :text="importTooltipText"
        >
          <KButton
            appearance="tertiary"
            aria-label="Copy import statement"
            class="copy-import"
            size="small"
            @click="handleCopy(copyToClipboard)"
          >
            <DataObjectIcon
              decorative
              :size="`var(--kui-icon-size-30, ${KUI_ICON_SIZE_30})`"
            />
          </KButton>
        </KTooltip>
      </KClipboardProvider>
    </div>

    <component
      :is="icon"
      :color="color"
      decorative
      :size="`var(--kui-icon-size-70, ${KUI_ICON_SIZE_70})`"
      :title="iconName"
    />
    <KCopy
      class="icon-name"
      :monospace="false"
      :text="iconName"
    />
    <span
      v-if="title"
      class="icon-title"
    >
      {{ title }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { KUI_ICON_SIZE_30, KUI_ICON_SIZE_70 } from '@kong/design-tokens'
import { DataObjectIcon } from '../../src/components/solid'

const {
  color,
  icon,
  title = null,
} = defineProps<{
  color?: string
  icon: Record<string, any>
  title?: string
}>()

const iconName = computed((): string => icon?.__name || '')

const importTooltipText = ref<string>('Copy import')

const handleCopy = (copyToClipboard: (text: string) => void) => {
  copyToClipboard(`import { ${iconName.value} } from '@kong/icons'`)
  importTooltipText.value = 'Copied!'
  setTimeout(() => {
    importTooltipText.value = 'Copy import'
  }, 3000)
}
</script>

<style lang="scss" scoped>
.sandbox-icon {
  align-items: center;
  border: var(--kui-border-width-10, $kui-border-width-10) solid var(--kui-color-border-neutral-weaker, $kui-color-border-neutral-weaker);
  border-radius: var(--kui-border-radius-20, $kui-border-radius-20);
  color: var(--kui-color-text-info, $kui-color-text-info);
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--kui-space-60, $kui-space-60) var(--kui-space-40, $kui-space-40);
  position: relative;

  &:hover {
    border-color: var(--kui-color-border-neutral-weak, $kui-color-border-neutral-weak);

    .actions-container {
      opacity: 1;
      pointer-events: all;
    }
  }
}

.actions-container {
  display: flex;
  opacity: 0;
  padding: var(--kui-space-40, $kui-space-40);
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity 0.2s ease-in;
  width: 100%;

  .copy-import {
    position: absolute;
    right: 8px;
  }
}

.icon-name {
  margin-top: var(--kui-space-50, $kui-space-50);

  :deep(.copy-text) {
    color: #333;
    font-family: var(--kui-font-family-text, $kui-font-family-text);
    font-size: var(--kui-font-size-30, $kui-font-size-30);
    font-weight: var(--kui-font-weight-medium, $kui-font-weight-medium);
  }

  :deep(.text-icon-wrapper) {
    color: #333;

    &:hover {
      color: #292929;
    }
  }
}

.icon-title {
  color: #999;
  font-size: var(--kui-font-size-30, $kui-font-size-30);
  font-weight: 300;
  margin-top: var(--kui-space-20, $kui-space-20);
}
</style>
