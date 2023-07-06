import { defineConfig } from 'vite'
import path from 'path'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // Alias src directory for @/components/{KongponentName} imports
      '@': path.resolve(__dirname, '../src/'),
      '@vitepress': path.resolve(__dirname, './.vitepress/'),
      // We must alias `@kong/design-tokens` imports to specifically utilize the esm build
      '@kong/design-tokens/tokens/scss/variables': path.resolve(__dirname, '../node_modules/@kong/design-tokens/dist/tokens/scss/variables.scss'),
      '@kong/design-tokens': path.resolve(__dirname, '../node_modules/@kong/design-tokens/dist/tokens/js/'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Inject the @kong/design-tokens SCSS variables since our docs site imports Kongponents locally (i.e. not compiled)
        // This is not needed in host applications.
        additionalData: '@import "@kong/design-tokens/tokens/scss/variables";',
      },
    },
  },
})
