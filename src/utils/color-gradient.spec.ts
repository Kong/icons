import { describe, it, expect } from 'vitest'
import {
  GRADIENT_ID_BASE,
  DEFAULT_GRADIENT_ANGLE,
  isValidGradientColor,
  parseGradientDirection,
  computeGradientCoordinates,
  createGradientId,
  resolveColorGradient,
  applyColorGradient,
} from './color-gradient'
import type { ColorGradient } from '@/types/color-gradient'

describe('isValidGradientColor', () => {
  it.each([
    '#fff',
    '#ffff',
    '#0044F4',
    '#0044F4FF',
    'rgb(0, 68, 244)',
    'rgba(0, 68, 244, 0.5)',
    'rgb(0 68 244 / 50%)',
    'var(--kui-color-brand)',
    'var(--kui-color-accent, #00D6A4)',
    // Fallback values, including nested custom properties with their own fallbacks
    'var(--kui-color-text-accent, #007ac1)',
    'var(--a, var(--b, #007ac1))',
    'var(--a, var(--b, var(--c, #007ac1)))',
    'var(--a, var(--b))',
    'var(--kui-color-x, currentColor)',
    'var(--a, rgb(0, 122, 193))',
  ])('accepts the valid color %s', (value) => {
    expect(isValidGradientColor(value)).toBe(true)
  })

  it.each([
    '',
    'red',
    'blue',
    '#12',
    '#12345',
    '0044F4',
    'rgb(0, 68)',
    'hsl(200, 50%, 50%)',
    // Empty or malformed fallbacks
    'var(--a, )',
    'var(--a,)',
    // Injection attempts must be rejected (validation doubles as sanitization)
    '#fff" onload="alert(1)',
    'var(--x, "><script>)',
    'var(--a, #fff)<script>',
    'var(--a, foo<bar)',
    'rgb(0,0,0);}</style>',
  ])('rejects the invalid color %s', (value) => {
    expect(isValidGradientColor(value)).toBe(false)
  })
})

describe('parseGradientDirection', () => {
  it('accepts a finite number', () => {
    expect(parseGradientDirection(90)).toBe(90)
    expect(parseGradientDirection(0)).toBe(0)
    expect(parseGradientDirection(-45)).toBe(-45)
    expect(parseGradientDirection(45.5)).toBe(45.5)
  })

  it('accepts a numeric string with or without a `deg` suffix', () => {
    expect(parseGradientDirection('90')).toBe(90)
    expect(parseGradientDirection('90deg')).toBe(90)
    expect(parseGradientDirection(' 135deg ')).toBe(135)
    expect(parseGradientDirection('-45deg')).toBe(-45)
  })

  it.each([
    'sideways',
    '',
    'deg',
    'to-right',
    '90px',
    NaN,
    Infinity,
  ])('falls back to the default angle for the invalid value %s', (value) => {
    expect(parseGradientDirection(value as string | number)).toBe(DEFAULT_GRADIENT_ANGLE)
  })
})

describe('computeGradientCoordinates', () => {
  it('computes upward endpoints for 0deg', () => {
    expect(computeGradientCoordinates(0)).toEqual({ x1: '12', y1: '24', x2: '12', y2: '0' })
  })

  it('computes rightward endpoints for 90deg', () => {
    expect(computeGradientCoordinates(90)).toEqual({ x1: '0', y1: '12', x2: '24', y2: '12' })
  })

  it('computes downward endpoints for 180deg', () => {
    expect(computeGradientCoordinates(180)).toEqual({ x1: '12', y1: '0', x2: '12', y2: '24' })
  })

  it('computes a top-left to bottom-right diagonal for the default 135deg', () => {
    const { x1, y1, x2, y2 } = computeGradientCoordinates(135)
    // Start near the top-left, end near the bottom-right
    expect(Number(x1)).toBeLessThan(Number(x2))
    expect(Number(y1)).toBeLessThan(Number(y2))
    expect(Number(x1)).toBeCloseTo(3.5147, 3)
    expect(Number(y2)).toBeCloseTo(20.4853, 3)
  })
})

describe('createGradientId', () => {
  it('returns the stable base id when `staticId` is true', () => {
    expect(createGradientId(true)).toBe(GRADIENT_ID_BASE)
  })

  it('returns a unique, prefixed id by default', () => {
    const first = createGradientId()
    const second = createGradientId()

    expect(first).toMatch(new RegExp(`^${GRADIENT_ID_BASE}-[a-z0-9]+$`))
    expect(second).toMatch(new RegExp(`^${GRADIENT_ID_BASE}-[a-z0-9]+$`))
    expect(first).not.toBe(second)
  })
})

describe('resolveColorGradient', () => {
  it('returns a gradient definition when both colors are valid', () => {
    const gradient = resolveColorGradient({ id: 'test-id', start: '#0044F4', stop: '#00D6A4', direction: 90 })

    expect(gradient).toEqual({
      id: 'test-id',
      start: '#0044F4',
      stop: '#00D6A4',
      x1: '0',
      y1: '12',
      x2: '24',
      y2: '12',
    })
  })

  it('trims surrounding whitespace from colors', () => {
    const gradient = resolveColorGradient({ id: 'test-id', start: '  #0044F4  ', stop: '#00D6A4', direction: 90 })

    expect(gradient?.start).toBe('#0044F4')
  })

  it('uses the default angle for an invalid direction', () => {
    const gradient = resolveColorGradient({ id: 'test-id', start: '#0044F4', stop: '#00D6A4', direction: 'sideways' })
    const expected = computeGradientCoordinates(DEFAULT_GRADIENT_ANGLE)

    expect(gradient).toMatchObject(expected)
  })

  it.each([
    { start: '#0044F4', stop: 'not-a-color' },
    { start: 'not-a-color', stop: '#00D6A4' },
    { start: '', stop: '#00D6A4' },
    { start: '', stop: '' },
  ])('returns null when a color is missing or invalid (%o)', ({ start, stop }) => {
    expect(resolveColorGradient({ id: 'test-id', start, stop, direction: 135 })).toBeNull()
  })
})

describe('applyColorGradient', () => {
  const gradient: ColorGradient = {
    id: 'kong-icon-gradient',
    start: '#111111',
    stop: '#222222',
    x1: '0',
    y1: '0',
    x2: '24',
    y2: '24',
  }

  it('repoints painting fills to the generated gradient and appends its definition', () => {
    const svg = '<path d="M0 0" fill="currentColor"/>'
    const result = applyColorGradient(svg, gradient)

    expect(result).toContain('fill="url(#kong-icon-gradient)"')
    expect(result).not.toContain('fill="currentColor"')
    expect(result).toContain('<linearGradient id="kong-icon-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">')
    expect(result).toContain('<stop stop-color="#111111"/>')
    expect(result).toContain('<stop offset="1" stop-color="#222222"/>')
  })

  it('overrides an existing gradient fill reference', () => {
    const svg = '<path fill="url(#paint0_linear)"/><defs><linearGradient id="paint0_linear"></linearGradient></defs>'
    const result = applyColorGradient(svg, gradient)

    expect(result).toContain('fill="url(#kong-icon-gradient)"')
    expect(result).not.toContain('fill="url(#paint0_linear)"')
  })

  it('does not repoint `fill="none"`', () => {
    const svg = '<path fill="none" stroke="#000"/>'
    const result = applyColorGradient(svg, gradient)

    expect(result).toContain('fill="none"')
  })

  it('preserves fills inside <defs>, <mask>, and <clipPath> blocks', () => {
    const svg = [
      '<rect fill="#abcabc"/>',
      '<defs>',
      '<clipPath id="c"><rect fill="white"/></clipPath>',
      '<mask id="m"><rect fill="black"/></mask>',
      '</defs>',
    ].join('')
    const result = applyColorGradient(svg, gradient)

    // The body rect is repointed
    expect(result).not.toContain('fill="#abcabc"')
    // The clipPath and mask fills are untouched
    expect(result).toContain('<clipPath id="c"><rect fill="white"/></clipPath>')
    expect(result).toContain('<mask id="m"><rect fill="black"/></mask>')
  })

  it('leaves stroke colors untouched', () => {
    const svg = '<path fill="#abcabc" stroke="white"/>'
    const result = applyColorGradient(svg, gradient)

    expect(result).toContain('stroke="white"')
    expect(result).not.toContain('fill="#abcabc"')
  })

  it('uses the id from the provided gradient definition', () => {
    const result = applyColorGradient('<path fill="#000"/>', { ...gradient, id: 'kong-icon-gradient-abc123' })

    expect(result).toContain('id="kong-icon-gradient-abc123"')
    expect(result).toContain('fill="url(#kong-icon-gradient-abc123)"')
  })
})
