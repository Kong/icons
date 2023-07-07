import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path, { join } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// Include the rollup-plugin-visualizer if the BUILD_VISUALIZER env var is set to "true"
const buildVisualizerPlugin = process.env.BUILD_VISUALIZER
  ? visualizer({
    filename: path.resolve(__dirname, 'bundle-analyzer/stats-treemap.html'),
    template: 'treemap', // sunburst|treemap|network
    sourcemap: true,
    gzipSize: true,
  })
  : undefined

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // TODO: Verify injecting the styles here will not create downstream issues, including if the Icons are mounted in the shadowDOM
    // https://github.com/vitejs/vite/issues/1579
    // https://www.npmjs.com/package/vite-plugin-css-injected-by-js
    cssInjectedByJsPlugin(),
  ],
  resolve: {
    alias: {
      // Alias src directory for imports
      '@': path.resolve(__dirname, './src/'),
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        // Inject the @kong/design-tokens SCSS variables to make them available for all components.
        // This is not needed in host applications.
        additionalData: '@import "@kong/design-tokens/tokens/scss/variables";',
      },
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'KongIcons',
      fileName: (format) => `kong-icons.${format}.js`,
    },
    emptyOutDir: true,
    minify: true,
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
      },
      plugins: [
        // visualizer must remain last in the list of plugins
        buildVisualizerPlugin,
      ],
    },
  },
  optimizeDeps: {
    include: [
      'vue',
    ],
  },
  server: {
    fs: {
      // Allow serving files from one level up from the package root - IMPORTANT - to support the sandbox
      allow: [join(__dirname, '..')],
    },
  },
  // Change the root when utilizing the sandbox via USE_SANDBOX=true to use the `/sandbox/*` files
  // During the build process, the `/sandbox/*` files are not used and we should default to the package root.
  root: process.env.USE_SANDBOX ? './sandbox' : process.cwd(),
})
