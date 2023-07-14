import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// @ts-ignore
export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      registerNodeLoader: true, // Ensure modules are imported properly
    },
    include: ['**/*.spec.ts'],
    exclude: [
      './dist/**',
      './sandbox/**',
      'node_modules',
    ],
    // The tests will only successfully run after the `yarn generate` script has been run.
    // This `globalSetup` entry generates all comopnents before running the tests
    globalSetup: [
      './scripts/utilities/generate-icon-components.ts',
    ],
  },
}))
