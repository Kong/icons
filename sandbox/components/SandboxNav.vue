<template>
  <nav>
    <ul>
      <li
        v-for="link in links"
        :key="JSON.stringify(link.to)"
        class="sandbox-link"
      >
        <router-link :to="link.to">
          {{ link.name }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, nextTick } from 'vue'
import { RouteLocationRaw } from 'vue-router'

interface SandboxNavItem {
  to: RouteLocationRaw
  name: string
}

const links = computed((): SandboxNavItem[] => {
  const componentLinks: SandboxNavItem[] = []

  // Iterate through the globally-defined component list (see `vite.config.ts` => `define`)
  for (const component of ICON_COMPONENT_LIST) {
    componentLinks.push({
      name: component,
      to: { name: 'icon', params: { icon: component } },
    })
  }

  return componentLinks
})

onMounted(async () => {
  await nextTick()

  const activeLink: HTMLLinkElement | null = document.querySelector('.router-link-exact-active')
  activeLink?.scrollIntoView({ behavior: 'smooth' })
})
</script>

<style lang="scss" scoped>
nav {
  max-height: 400px;
  overflow-y: auto;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sandbox-link {
  margin-bottom: 8px;

  &:last-of-type {
    margin-bottom: 0;
  }

  a {
    background: #eee;
    border-radius: 4px;
    color: #007ac1;
    display: flex;
    font-weight: 500;
    padding: 8px 16px;
    text-decoration: none;
    transition: all .2s ease-in-out;

    &:hover {
      background: #ccc;
      color: var(--blue-700);
    }

    &.router-link-active {
      background: #007ac1;
      color: #fff;

      &:hover {
        background: #007ac1;
        color: #fff;
      }
    }
  }
}
</style>
