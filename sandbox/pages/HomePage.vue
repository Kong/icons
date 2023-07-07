<template>
  <div class="sandbox-header">
    <router-link
      class="home-link"
      :to="{ name: 'home'}"
    >
      <h1>
        Kong Icons Sandbox
      </h1>
    </router-link>
  </div>
  <div class="sandbox-layout">
    <div class="nav-container">
      <SandboxNav />
    </div>
    <div class="sandbox-container">
      <p v-if="route.name === 'home'">
        Navigate to a path of <code>/icons/{IconName}</code> to preview a rendered icon
      </p>
      <router-view :key="route.fullPath" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SandboxNav from '../components/SandboxNav.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style lang="scss" scoped>
@import './../styles/sandbox-variables';

.sandbox-header {
  align-items: center;
  border-bottom: 1px solid lightgray;
  display: inline-flex;
  justify-content: space-between;
  padding: 20px;
  width: 100%;

  @media only screen and (min-width: $viewport-xl) {
    border: none;
  }

  h1 {
    font-size: 18px;
    margin: 0;

    @media only screen and (min-width: $viewport-md) {
      font-size: 24px;
    }
  }
}

.sandbox-layout {
  display: flex;
  padding: 20px;

  .nav-container {
    display: block;
    margin-right: 20px;
    min-width: 280px;
  }
}

.sandbox-container {
  min-height: 50vh;
  width: 100%;

  @media only screen and (min-width: $viewport-xl) {
    border: 1px solid lightgray;
    padding: 20px;
  }

  .sandbox-welcome {
    margin: 0 auto;
    max-width: 700px;

    h2 {
      text-align: center;
    }
  }
}

.home-link {
  color: #000;
  text-decoration: none;
}

code {
  background: #eee;
  border-radius: 4px;
  color: #007ac1;
  font-family: monospace;
  font-size: 16px;
  padding: 2px 4px;
}
</style>
