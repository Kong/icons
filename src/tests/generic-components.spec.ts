import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import * as importedComponents from '../components'

const componentKeys = Object.keys(importedComponents)
// Grab a random component from the `/src/components/` directory
// @ts-ignore
const component = importedComponents[componentKeys[Math.floor(Math.random() * componentKeys.length)]]

describe(`Icon Components (randomly testing '${component.__name}.vue')`, () => {
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

  describe('wrapper element', () => {
    it('tag has a line-height of zero', () => {
      const wrapper = mount(component)

      const iconWrapper = wrapper.find('.kui-icon').element
      const iconWrapperStyles = getComputedStyle(iconWrapper)

      expect(iconWrapperStyles.lineHeight).toEqual('0')
    })

    it('renders a span tag by default', () => {
      const wrapper = mount(component)

      expect(wrapper.find('span.kui-icon').exists()).toBe(true)
    })
  })

  describe('svg element', () => {
    it('has a `fill` attribute of `none`', () => {
      const wrapper = mount(component)

      const iconWrapper = wrapper.find('svg').element

      expect(iconWrapper.getAttribute('fill')).toEqual('none')
    })

    it('has `width` and `height` attributes of `100%`', () => {
      const wrapper = mount(component)

      const iconWrapper = wrapper.find('svg').element

      expect(iconWrapper.getAttribute('width')).toEqual('100%')
      expect(iconWrapper.getAttribute('height')).toEqual('100%')
    })

    it('has a `role` attribute of `img`', () => {
      const wrapper = mount(component)

      const iconWrapper = wrapper.find('svg').element

      expect(iconWrapper.getAttribute('role')).toEqual('img')
    })

    it('has a `viewBox` attribute of `0 0 24 24`', () => {
      const wrapper = mount(component)

      const iconWrapper = wrapper.find('svg').element

      expect(iconWrapper.getAttribute('viewBox')).toEqual('0 0 24 24')
    })

    it('has a `xmlns` attribute of `http://www.w3.org/2000/svg`', () => {
      const wrapper = mount(component)

      const iconWrapper = wrapper.find('svg').element

      expect(iconWrapper.getAttribute('xmlns')).toEqual('http://www.w3.org/2000/svg')
    })
  })

  describe('Component Props', () => {
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

    describe('display', () => {
      it('defaults to `block` if display prop is not provided', () => {
        const wrapper = mount(component)

        const iconWrapper = wrapper.find('.kui-icon').element
        const iconWrapperStyles = getComputedStyle(iconWrapper)

        expect(iconWrapperStyles.display).toEqual('block')
      })

      it('customizes the display attribute if display prop is provided', () => {
        const display = 'inline-flex'

        const wrapper = mount(component, {
          props: {
            display,
          },
        })

        const iconWrapper = wrapper.find('.kui-icon').element
        const iconWrapperStyles = getComputedStyle(iconWrapper)

        expect(iconWrapperStyles.display).toEqual(display)
      })
    })

    describe('decorative', () => {
      it('does not add `aria-hidden` attribute if decorative prop is false', () => {
        const wrapper = mount(component)

        expect(wrapper.find('svg[aria-hidden="true"').exists()).toBe(false)
      })

      it('adds `aria-hidden="true"` if decorative prop is true', () => {
        const wrapper = mount(component, {
          props: {
            decorative: true,
          },
        })

        expect(wrapper.find('svg[aria-hidden="true"').exists()).toBe(true)
      })
    })

    describe('size', () => {
      it('defaults to a size when the size prop is not provided', () => {
        const wrapper = mount(component)

        const iconWrapper = wrapper.find('.kui-icon').element
        const iconWrapperStyles = getComputedStyle(iconWrapper)

        expect(iconWrapperStyles.width).toBe('24px')
        expect(iconWrapperStyles.height).toBe('24px')
      })

      it('customizes the size of the icon if the size prop is provided', () => {
        const size = 64
        const wrapper = mount(component, {
          props: {
            size,
          },
        })

        const iconWrapper = wrapper.find('.kui-icon').element
        const iconWrapperStyles = getComputedStyle(iconWrapper)

        expect(iconWrapperStyles.width).toBe(`${size}px`)
        expect(iconWrapperStyles.height).toBe(`${size}px`)
      })
    })

    describe('tag', () => {
      it('defaults to a `span` tag when the tag prop is not provided', () => {
        const wrapper = mount(component)

        const iconWrapper = wrapper.find('span.kui-icon')

        expect(iconWrapper.exists()).toBe(true)
      })

      it('customizes the HTML wrapper element if the tag prop is provided', () => {
        const tag = 'section'
        const wrapper = mount(component, {
          props: {
            tag,
          },
        })

        const spanWrapper = wrapper.find('span.kui-icon')
        const iconWrapper = wrapper.find(`${tag}.kui-icon`)

        expect(spanWrapper.exists()).toBe(false)
        expect(iconWrapper.exists()).toBe(true)
      })
    })
  })
})
