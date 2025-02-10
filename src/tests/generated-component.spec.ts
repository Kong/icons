import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import * as importedComponents from '../components'
import { KUI_COLOR_TEXT_PRIMARY } from '@kong/design-tokens'

// Loop through and test all Icon Components
for (const [componentName, IconComponent] of Object.entries(importedComponents)) {
  describe(`${componentName}.vue`, () => {
    it('has proper default structure', () => {
      // @ts-ignore: dynamic component
      const wrapper = mount(IconComponent)

      expect(wrapper.exists()).toBe(true)
      // elements
      const tag = wrapper.get('.kui-icon')
      const svg = wrapper.get('svg')

      // tag element
      expect(tag.isVisible()).toBe(true)

      // SVG element
      expect(svg.isVisible()).toBe(true)
    })

    it('matches snapshot', async () => {
      // @ts-ignore: dynamic component interface
      const wrapper = mount(IconComponent, {
        props: {
          staticIds: true, // Prevents random IDs from being generated for consistent snapshot testing
          title: 'My custom title',
          color: KUI_COLOR_TEXT_PRIMARY,
          display: 'inline-flex',
          decorative: false,
          size: 32,
          as: 'span',
        },
      })

      await expect(wrapper.html()).toMatchFileSnapshot(`./__snapshots__/${componentName}.html`)
    })

    describe('wrapper element', () => {
      it('tag has a line-height of zero', () => {
        const wrapper = mount(IconComponent)
        const iconWrapper = wrapper.find('.kui-icon').element
        const iconWrapperStyles = getComputedStyle(iconWrapper)

        expect(iconWrapperStyles.lineHeight).toEqual('0')
      })

      it('renders a span tag by default', () => {
        const wrapper = mount(IconComponent)

        expect(wrapper.find('span.kui-icon').exists()).toBe(true)
      })
    })

    describe('svg element', () => {
      it('has a `fill` attribute of `none`', () => {
        const wrapper = mount(IconComponent)

        const iconWrapper = wrapper.find('svg').element

        expect(iconWrapper.getAttribute('fill')).toEqual('none')
      })

      it('has `width` and `height` attributes of `100%`', () => {
        const wrapper = mount(IconComponent)
        const iconWrapper = wrapper.find('svg').element

        expect(iconWrapper.getAttribute('width')).toEqual('100%')
        expect(iconWrapper.getAttribute('height')).toEqual('100%')
      })

      it('has a `role` attribute of `img`', () => {
        const wrapper = mount(IconComponent)

        const iconWrapper = wrapper.find('svg').element

        expect(iconWrapper.getAttribute('role')).toEqual('img')
      })

      it('has a `viewBox` attribute of `0 0 24 24`', () => {
        const wrapper = mount(IconComponent)
        const iconWrapper = wrapper.find('svg').element

        expect(iconWrapper.getAttribute('viewBox')).toEqual('0 0 24 24')
      })

      it('has a `xmlns` attribute of `http://www.w3.org/2000/svg`', () => {
        const wrapper = mount(IconComponent)
        const iconWrapper = wrapper.find('svg').element

        expect(iconWrapper.getAttribute('xmlns')).toEqual('http://www.w3.org/2000/svg')
      })
    })

    describe('Component Props', () => {
      describe('title', () => {
        it('does not render the title element if prop is not provided', () => {
          const wrapper = mount(IconComponent)

          expect(wrapper.find('[data-testid="kui-icon-svg-title"').exists()).toBe(false)
        })

        it('adds the <title> element if title prop is provided', () => {
          const title = 'My SVG title'
          const wrapper = mount(IconComponent, {
            props: {
              title,
            },
          })

          expect(wrapper.get('[data-testid="kui-icon-svg-title"').text()).toContain(title)
        })
      })

      describe('color', () => {
        it('defaults to `currentColor` if color prop is not provided', () => {
          const wrapper = mount(IconComponent)
          const iconWrapper = wrapper.find('.kui-icon').element
          const iconWrapperStyles = getComputedStyle(iconWrapper)

          expect(iconWrapperStyles.color).toEqual('currentColor')
        })

        it('customizes the color attribute if color prop is provided', () => {
          const color = '#007ac1'
          const wrapper = mount(IconComponent, {
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
          const wrapper = mount(IconComponent)
          const iconWrapper = wrapper.find('.kui-icon').element
          const iconWrapperStyles = getComputedStyle(iconWrapper)

          expect(iconWrapperStyles.display).toEqual('block')
        })

        it('customizes the display attribute if display prop is provided', () => {
          const display = 'inline-flex'
          const wrapper = mount(IconComponent, {
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
          const wrapper = mount(IconComponent)

          expect(wrapper.find('svg[aria-hidden="true"').exists()).toBe(false)
        })

        it('adds `aria-hidden="true"` if decorative prop is true', () => {
          const wrapper = mount(IconComponent, {
            props: {
              decorative: true,
            },
          })

          expect(wrapper.find('svg[aria-hidden="true"').exists()).toBe(true)
        })
      })

      describe('size', () => {
        it('defaults to a size when the size prop is not provided', () => {
          const wrapper = mount(IconComponent)
          const iconWrapper = wrapper.find('.kui-icon').element
          const iconWrapperStyles = getComputedStyle(iconWrapper)

          expect(iconWrapperStyles.width).toBe('24px')
          expect(iconWrapperStyles.height).toBe('24px')
        })

        it('customizes the size of the icon if the size prop is provided', () => {
          const size = 64
          const wrapper = mount(IconComponent, {
            props: {
              size,
            },
          })
          const iconWrapper = wrapper.find('.kui-icon').element
          const iconWrapperStyles = getComputedStyle(iconWrapper)

          expect(iconWrapperStyles.width).toBe(`${size}px`)
          expect(iconWrapperStyles.height).toBe(`${size}px`)
        })

        it('accepts a string prop value', () => {
          const size = '48'
          const wrapper = mount(IconComponent, {
            props: {
              size,
            },
          })
          const iconWrapper = wrapper.find('.kui-icon').element
          const iconWrapperStyles = getComputedStyle(iconWrapper)

          expect(iconWrapperStyles.width).toBe(`${size}px`)
          expect(iconWrapperStyles.height).toBe(`${size}px`)
        })

        it('converts a string with `px` suffix to a valid icon size', () => {
          const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => null)
          const size = '64px'

          mount(IconComponent, {
            props: {
              size,
            },
          })

          expect(consoleSpy).not.toHaveBeenCalledOnce()
          consoleSpy.mockReset()
        })

        it('console.warns if the size prop cannot be coverted to a number', () => {
          const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => null)
          const size = '64units'

          mount(IconComponent, {
            props: {
              size,
            },
          })

          expect(consoleSpy).toHaveBeenCalledOnce()
          consoleSpy.mockReset()
        })
      })

      describe('as', () => {
        it('defaults to a `span` tag when the as prop is not provided', () => {
          const wrapper = mount(IconComponent)
          const iconWrapper = wrapper.find('span.kui-icon')

          expect(iconWrapper.exists()).toBe(true)
        })

        it('customizes the HTML wrapper element if the as prop is provided', () => {
          const as = 'button'
          const wrapper = mount(IconComponent, {
            props: {
              as,
            },
          })

          // Look for default element
          const spanWrapper = wrapper.find('span.kui-icon')
          expect(spanWrapper.exists()).toBe(false)

          const iconWrapper = wrapper.find(`${as}.kui-icon`)
          expect(iconWrapper.exists()).toBe(true)
        })
      })
    })
  })
}
