import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path, { join } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { getSubdirectories } from './scripts/utilities'

// Include the rollup-plugin-visualizer if the BUILD_VISUALIZER env var is set to "true"
const buildVisualizerPlugin = process.env.BUILD_VISUALIZER
  ? visualizer({
    filename: path.resolve(__dirname, 'bundle-analyzer/stats-treemap.html'),
    template: 'treemap', // sunburst|treemap|network
    sourcemap: true,
    gzipSize: true,
  })
  : undefined

const getEntryPoints = () => {
  // Initialize the entryPoints object with the default export already configured
  const entryPoints = {
    default: path.resolve(__dirname, 'src/index.ts'),
  }
  const componentDirectories = getSubdirectories(path.resolve('./src/components'))

  for (const dir of componentDirectories) {
    entryPoints[dir] = path.resolve(__dirname, `src/components/${dir}/index.ts`)
  }

  return entryPoints
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
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
      entry: getEntryPoints(),
      name: 'KongIcons',
      fileName: (format, entryName) => entryName === 'default' ? `kong-icons.${format}.js` : `kong-icons.${entryName}.${format}.js`,
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
