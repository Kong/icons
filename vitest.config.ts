import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// @ts-ignore
export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
    exclude: [
      './dist/**',
      './sandbox/**',
      'node_modules',
    ],
    deps: {
      optimizer: {
        web: {
          // https://github.com/vitest-dev/vitest/issues/4074
          exclude: ['vue'],
        },
      },
    },
    // The tests will only successfully run after the `yarn generate` script has been run.
    // This `globalSetup` entry generates all comopnents before running the tests
    globalSetup: [
      './scripts/utilities/generate-icon-components.ts',
    ],
  },
}))
