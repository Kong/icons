import eslintKongUiConfig from '@kong/eslint-config-kong-ui'
import designTokens from '@kong/eslint-plugin-design-tokens'

export default [
  ...eslintKongUiConfig,
  // Allow v-html in the ComponentTemplate
  {
    files: [
      'src/__template__/ComponentTemplate.vue',
      'src/components/**',
    ],
    rules: {
      'vue/no-v-html': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    plugins: {
      '@kong/design-tokens': designTokens,
    },
    rules: {
      '@kong/design-tokens/token-constant-requires-css-var': 'error',
    },
  },
]
