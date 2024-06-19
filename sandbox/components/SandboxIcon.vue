<template>
  <span
    class="sandbox-icon"
    @mouseleave="showCopyImport = false"
    @mouseover="showCopyImport = true"
  >
    <div
      v-if="showCopyImport"
      class="copy-import-container"
    >
      <KClipboardProvider v-slot="{ copyToClipboard }">
        <KTooltip
          placement="bottomEnd"
          :popover-timeout="300"
          :text="importTooltipText"
        >
          <button
            class="copy-import"
            @click="() => {
              copyToClipboard(`import { ${iconName} } from '@kong/icons'`)
              onCopyImportClick()
            }"
          >
            <DataObjectIcon size="16" />
          </button>
        </KTooltip>
      </KClipboardProvider>
    </div>

    <component
      :is="icon"
      size="40"
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
    >{{ title }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { DataObjectIcon } from '../../src/components/solid'

const props = defineProps({
  icon: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: false,
    default: null,
  },
})

const iconName = computed((): string => props.icon?.__name || '')

const showCopyImport = ref<boolean>(false)

const importTooltipInitial = 'Copy import'
const importTooltipText = ref<string>(importTooltipInitial)

const onCopyImportClick = () => {
  importTooltipText.value = 'Copied!'
}

watch(importTooltipText, () => {
  // change tooltip text back to original after 3 seconds
  setTimeout(() => {
    importTooltipText.value = importTooltipInitial
  }, 3000)
})
</script>

<style lang="scss" scoped>
.sandbox-icon {
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #0044f4;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px 8px;
  position: relative;
}

.copy-import-container {
  position: absolute;
  right: 8px;
  top: 8px;

  .copy-import {
    background-color: transparent;
    border: none;
    color: inherit;
    color: #333;
    cursor: pointer;
    padding: 0;

    &:hover {
      color: #292929;
    }
  }
}

.icon-name {
  margin-top: 12px;

  :deep(.copy-text) {
    color: #333;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
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
  font-size: 14px;
  font-weight: 300;
  margin-top: 4px;
}
</style>
