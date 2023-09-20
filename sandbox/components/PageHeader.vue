<template>
  <div class="sandbox-header">
    <h1>
      <a
        class="home-link"
        href="https://github.com/Kong/icons"
        target="_blank"
        title="View on GitHub"
      >Kong Icons
        <ExternalLinkIcon
          as="span"
          display="inline-block"
          :size="16"
        />
      </a>
    </h1>
    <div class="search">
      <input
        v-model.trim="query"
        placeholder="Search icons"
        type="search"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ExternalLinkIcon } from '@/components'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const emit = defineEmits<{
  (e: 'search', value: string): void
}>()

const query = ref('')

watch(query, (searchQuery: string) => {
  emit('search', searchQuery)

  if (searchQuery) {
    router.push({ name: 'home', query: { search: searchQuery } })
  } else {
    router.push({ name: 'home' })
  }
}, { immediate: true })

onMounted(() => {
  if (route.query.search) {
    query.value = route.query.search as string
  }
})
</script>

<style lang="scss" scoped>
$header-height: 80px;

.sandbox-header {
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid lightgray;
  box-shadow: 0 0 8px rgba(0, 0, 0, .25);
  display: inline-flex;
  height: $header-height;
  justify-content: space-between;
  left: 0;
  padding: 20px;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;

  h1 {
    font-size: 18px;
    margin: 0;

    @media (min-width: $kui-breakpoint-phablet) {
      font-size: 24px;
    }
  }
}

.home-link {
  color: $kui-color-text-primary-strong;
  margin-right: $kui-space-70;
  outline: none;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  white-space: nowrap;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 1px solid $kui-color-text-primary;
  }

  &:hover {
    color: $kui-color-text-primary-stronger;
  }
}

.search {
  max-width: 300px;
  width: 100%;

  input {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: none;
    font-size: 16px;
    height: 40px;
    padding: 4px 8px;
    width: 100%;
  }
}
</style>
