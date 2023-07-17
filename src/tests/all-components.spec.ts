import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import * as importedComponents from '../components'
import { KUI_COLOR_TEXT_PRIMARY } from '@kong/design-tokens'

for (const [componentName, component] of Object.entries(importedComponents)) {
  describe(componentName, () => {
    it('matches snapshot', () => {
      const wrapper = mount(component, {
        props: {
          title: 'My custom title',
          color: KUI_COLOR_TEXT_PRIMARY,
          display: 'inline-flex',
          decorative: false,
          size: 32,
          tag: 'span',
        },
      })

      expect(wrapper.html()).toMatchFileSnapshot(`./__snapshots__/all-components/${componentName}.html`)
    })
  })
}
