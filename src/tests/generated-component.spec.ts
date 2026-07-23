import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import * as importedComponents from '../components'
import * as flagIcons from '../components/flags'
import * as solidIcons from '../components/solid'
import { AddIcon } from '../components/solid'
import { ServerlessGradientIcon, GithubIcon, HuggingFaceIcon } from '../components/multi-color'
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

        it('accepts a CSS var() custom property string', () => {
          const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => null)
          const size = 'var(--kui-icon-size-50, 24px)'

          const wrapper = mount(IconComponent, {
            props: {
              size,
            },
          })

          expect(consoleSpy).not.toHaveBeenCalled()
          consoleSpy.mockReset()

          const iconWrapper = wrapper.find('.kui-icon').element as HTMLElement
          expect(iconWrapper.style.width).toBe(size)
          expect(iconWrapper.style.height).toBe(size)
        })

        it('console.warns if the size prop is an unsupported CSS function value', () => {
          const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => null)
          const size = 'calc(100% - 4px)'

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

      describe('color gradient', () => {
        // With `staticIds: true` the injected gradient id is not prefixed
        const gradientId = 'kong-icon-gradient'
        // Flag icons never receive a gradient, regardless of the provided colors
        const isFlag = componentName in flagIcons
        // Solid icons use `currentColor` fills, so a gradient always applies to them
        const isSolid = componentName in solidIcons

        if (isFlag) {
          it('never applies a gradient to flag icons (silently), even with valid colors', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => null)
            const wrapper = mount(IconComponent, {
              props: {
                staticIds: true,
                colorGradientStart: '#0044F4',
                colorGradientStop: '#00D6A4',
              },
            })

            // Flag icons keep their official colors and skip the gradient without warning
            expect(wrapper.html()).not.toContain(gradientId)
            expect(consoleSpy).not.toHaveBeenCalled()
            consoleSpy.mockReset()
          })
        } else {
          // Solid icons (`currentColor` fills) always accept the gradient. Multi-color icons only accept it
          // when they have repointable fills (an existing `url(#…)` gradient), which is covered separately.
          if (isSolid) {
            it('applies a generated linear gradient when both start and stop colors are valid', () => {
              const wrapper = mount(IconComponent, {
                props: {
                  staticIds: true,
                  colorGradientStart: '#0044F4',
                  colorGradientStop: '#00D6A4',
                },
              })
              const html = wrapper.html()

              // Exactly one gradient definition is injected
              expect(html.match(new RegExp(`id="${gradientId}"`, 'g'))?.length).toBe(1)
              expect(html).toContain(`<linearGradient id="${gradientId}"`)
              // Fills are repointed to the generated gradient
              expect(html).toContain(`url(#${gradientId})`)
              // Both stop colors are present
              expect(html).toContain('#0044F4')
              expect(html).toContain('#00D6A4')
            })
          }

          it('does not apply a gradient (and warns) when only one color is provided', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => null)
            const wrapper = mount(IconComponent, {
              props: {
                staticIds: true,
                colorGradientStart: '#0044F4',
              },
            })

            expect(wrapper.html()).not.toContain(gradientId)
            expect(consoleSpy).toHaveBeenCalled()
            consoleSpy.mockReset()
          })

          it('does not apply a gradient (and warns) when a color is invalid', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => null)
            const wrapper = mount(IconComponent, {
              props: {
                staticIds: true,
                colorGradientStart: '#0044F4',
                colorGradientStop: 'not-a-real-color',
              },
            })

            expect(wrapper.html()).not.toContain(gradientId)
            expect(consoleSpy).toHaveBeenCalled()
            consoleSpy.mockReset()
          })
        }
      })
    })
  })
}

// The pure gradient logic (color validation, direction parsing, coordinate math, id generation,
// and the SVG transform) is unit-tested in `src/utils/color-gradient.spec.ts`. These integration
// tests verify the template correctly wires that logic into the rendered components.
describe('color gradient (component integration)', () => {
  const gradientId = 'kong-icon-gradient'

  it('overrides an existing gradient (a `url(#…)` fill) with the generated gradient', () => {
    // ServerlessGradientIcon is a single-shape icon whose fill is `url(#paint0_linear_2107_23107)` —
    // exactly the case designers want to recolor
    const wrapper = mount(ServerlessGradientIcon, {
      props: {
        staticIds: true,
        colorGradientStart: '#111111',
        colorGradientStop: '#222222',
      },
    })
    const html = wrapper.html()

    expect(html).toContain(`url(#${gradientId})`)
    // The original gradient reference is no longer used by any fill
    expect(html).not.toContain('url(#paint0_linear_2107_23107)')
    expect(html).toContain('#111111')
    expect(html).toContain('#222222')
  })

  it('does NOT flatten explicit-color multi-color icons (leaves their palette intact)', () => {
    // HuggingFaceIcon is a detailed logo built from explicit hex fills (no `currentColor`, no `url(#…)`)
    const wrapper = mount(HuggingFaceIcon, {
      props: {
        staticIds: true,
        colorGradientStart: '#111111',
        colorGradientStop: '#222222',
      },
    })
    const html = wrapper.html()

    // No gradient is applied and the original colors are preserved
    expect(html).not.toContain(gradientId)
    expect(html).toContain('#FFD21E')
    expect(html).toContain('#32343D')
  })

  it('does not repoint the explicit fills or stroke of a multi-color logo', () => {
    // GithubIcon uses explicit fills (`#24292F`, `white`) and `stroke="white"` — all must be preserved
    const wrapper = mount(GithubIcon, {
      props: {
        staticIds: true,
        colorGradientStart: '#111111',
        colorGradientStop: '#222222',
      },
    })
    const html = wrapper.html()

    expect(html).not.toContain(gradientId)
    expect(html).toContain('#24292F')
    expect(html).toContain('stroke="white"')
  })

  it('uses userSpaceOnUse so a single gradient spans the whole icon', () => {
    const wrapper = mount(AddIcon, {
      props: {
        staticIds: true,
        colorGradientStart: '#111111',
        colorGradientStop: '#222222',
      },
    })

    expect(wrapper.html()).toContain('gradientUnits="userSpaceOnUse"')
  })

  it('generates a unique gradient id per instance so multiple icons can coexist on a page', () => {
    /** Extract the (runtime-prefixed) linearGradient id from rendered HTML */
    const extractId = (html: string): string | undefined => /<linearGradient id="([^"]+)"/.exec(html)?.[1]

    // Without `staticIds`, each instance's ids are made unique at runtime
    const first = mount(AddIcon, { props: { colorGradientStart: '#111111', colorGradientStop: '#222222' } }).html()
    const second = mount(AddIcon, { props: { colorGradientStart: '#111111', colorGradientStop: '#222222' } }).html()

    const firstId = extractId(first)
    const secondId = extractId(second)

    expect(firstId).toBeTruthy()
    expect(secondId).toBeTruthy()
    expect(firstId).not.toBe(secondId)
    // Each icon's fill references its own gradient id
    expect(first).toContain(`url(#${firstId})`)
    expect(second).toContain(`url(#${secondId})`)
  })

  it('renders rgb() and var() color values through to the DOM', () => {
    const rgb = mount(AddIcon, {
      props: { staticIds: true, colorGradientStart: 'rgb(0, 68, 244)', colorGradientStop: 'rgba(0, 214, 164, 0.5)' },
    }).html()
    expect(rgb).toContain('rgb(0, 68, 244)')
    expect(rgb).toContain('rgba(0, 214, 164, 0.5)')

    const cssVar = mount(AddIcon, {
      props: { staticIds: true, colorGradientStart: 'var(--kui-color-brand)', colorGradientStop: 'var(--kui-color-accent, #00D6A4)' },
    }).html()
    expect(cssVar).toContain('var(--kui-color-brand)')
    expect(cssVar).toContain('var(--kui-color-accent, #00D6A4)')
  })
})
