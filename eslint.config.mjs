import eslintKongUiConfig from '@kong/eslint-config-kong-ui'

export default [
  ...eslintKongUiConfig,
  // Allow v-html in the ComponentTemplate
  {
    files: ['src/__template__/ComponentTemplate.vue'],
    rules: {
      'vue/no-v-html': 'off', // Set the rule level for 'vue/no-v-html'
    },
  },
]
