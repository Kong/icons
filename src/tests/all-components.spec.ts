import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import * as importedComponents from '../components'

for (const c in importedComponents) {
  const componentName = c
  // @ts-ignore
  const component = importedComponents[componentName]

  describe(componentName, () => {
    it('matches snapshot', () => {
      const wrapper = mount(component)

      expect(wrapper.html()).toMatchSnapshot()
    })
  })
}
