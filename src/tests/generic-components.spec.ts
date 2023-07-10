import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import * as importedComponents from '../components'

const componentKeys = Object.keys(importedComponents)
// Grab a random component from the `/src/components/` directory
// @ts-ignore
const component = importedComponents[componentKeys[Math.floor(Math.random() * componentKeys.length)]]

describe(`icon components (randomly testing '${component.__name}.vue')`, () => {
  it('has proper default structure', () => {
    const wrapper = mount(component)

    expect(wrapper.exists()).toBe(true)
    // elements
    const tag = wrapper.get('.kui-icon')
    const svg = wrapper.get('svg')

    // tag element
    expect(tag.isVisible()).toBe(true)

    // svg element
    expect(svg.isVisible()).toBe(true)
  })

  describe('props', () => {
    describe('title', () => {
      it('does not render the title element if prop is not provided', () => {
        const wrapper = mount(component)

        expect(wrapper.find('[data-testid="kui-icon-svg-title"').exists()).toBe(false)
      })

      it('adds the <title> element if title prop is provided', () => {
        const title = 'My svg title'

        const wrapper = mount(component, {
          props: {
            title,
          },
        })

        expect(wrapper.get('[data-testid="kui-icon-svg-title"').text()).toContain(title)
      })
    })

    describe('color', () => {
      it('defaults to `currentColor` if color prop is not provided', () => {
        const wrapper = mount(component)

        const iconWrapper = wrapper.find('.kui-icon').element
        const iconWrapperStyles = getComputedStyle(iconWrapper)

        expect(iconWrapperStyles.color).toEqual('currentColor')
      })

      it('customizes the color attribute if color prop is provided', () => {
        const color = '#007ac1'

        const wrapper = mount(component, {
          props: {
            color,
          },
        })

        const iconWrapper = wrapper.find('.kui-icon').element
        const iconWrapperStyles = getComputedStyle(iconWrapper)

        expect(iconWrapperStyles.color).toContain('rgb')
      })
    })
  })
})
