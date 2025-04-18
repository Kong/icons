import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import path, { join } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

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
    VueDevTools(),
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
        additionalData: `
        // Add to the global Sass namespace
        @use "@kong/design-tokens/tokens/scss/variables" as *;
        `,
      },
    },
  },
  base: process.env.USE_SANDBOX ? '/icons/' : '/',
  build: {
    lib: process.env.USE_SANDBOX
      ? undefined
      : {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'KongIcons',
        fileName: (format) => {
          if (format === 'cjs') {
            return 'kong-icons.cjs'
          } else {
            return `kong-icons.${format}.js`
          }
        },
        formats: ['es', 'cjs'],
      },
    emptyOutDir: true,
    minify: true,
    sourcemap: true,
    rollupOptions: {
      external: process.env.USE_SANDBOX ? undefined : ['vue'],
      output: process.env.USE_SANDBOX
        ? undefined
        : {
          globals: {
            vue: 'Vue',
          },
          exports: 'named',
          preserveModules: true,
          preserveModulesRoot: 'src',
          inlineDynamicImports: false,
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
    open: !!process.env.USE_SANDBOX,
    fs: {
      // Allow serving files from one level up from the package root - IMPORTANT - to support the sandbox
      allow: [join(__dirname, '..')],
    },
  },
  // Change the root when utilizing the sandbox via USE_SANDBOX=true to use the `/sandbox/*` files
  // During the build process, the `/sandbox/*` files are not used and we should default to the package root.
  root: process.env.USE_SANDBOX ? './sandbox' : process.cwd(),
})
