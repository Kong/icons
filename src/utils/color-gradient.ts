import type { ColorGradient } from '@/types/color-gradient'

/** The base `id` for generated `<linearGradient>` elements; a unique suffix is appended per icon instance. */
export const GRADIENT_ID_BASE = 'kong-icon-gradient'
/** The default gradient angle (in degrees) used when a direction is absent or invalid. */
export const DEFAULT_GRADIENT_ANGLE = 135

/** Matches a hex color: `#rgb`, `#rgba`, `#rrggbb`, or `#rrggbbaa` */
const HEX_COLOR_REGEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
/**
 * Matches an `rgb()`/`rgba()` color in either legacy comma syntax (`rgb(0, 68, 244)`, `rgba(0, 68, 244, 0.5)`)
 * or modern space syntax (`rgb(0 68 244)`, `rgb(0 68 244 / 50%)`). Requires three color channels plus an optional
 * alpha, so malformed values (e.g. `rgb(0, 68)`) are rejected. The restricted grammar also serves as sanitization.
 */
const RGB_COLOR_REGEX = /^rgba?\(\s*(?:\d{1,3}(?:\.\d+)?%?\s*,\s*\d{1,3}(?:\.\d+)?%?\s*,\s*\d{1,3}(?:\.\d+)?%?(?:\s*,\s*(?:\d*\.?\d+)%?)?|\d{1,3}(?:\.\d+)?%?\s+\d{1,3}(?:\.\d+)?%?\s+\d{1,3}(?:\.\d+)?%?(?:\s*\/\s*(?:\d*\.?\d+)%?)?)\s*\)$/i
/**
 * Matches a CSS `var()` custom-property color, including an optional fallback value.
 * The fallback may be any value — a hex/rgb color, a keyword, or another (nested) `var()` with its own
 * fallback — but quotes, angle brackets, and semicolons are disallowed so the value stays safe for injection
 * into the SVG string. Parens are permitted so nested `var()` fallbacks resolve, e.g.
 * `var(--a, var(--b, #007ac1))`.
 */
const CSS_VAR_COLOR_REGEX = /^var\(\s*--[\w-]+\s*(?:,\s*[^"'<>;\s][^"'<>;]*)?\)$/

/**
 * Returns true if the given value is a supported gradient color (hex, `rgb()`/`rgba()`, or `var()`).
 * The anchored regexes also serve as sanitization for values injected into an SVG string.
 *
 * @param {string} value - The color value to validate.
 * @returns {boolean} Whether the value is a supported gradient color.
 */
export const isValidGradientColor = (value: string): boolean =>
  typeof value === 'string' && (HEX_COLOR_REGEX.test(value) || RGB_COLOR_REGEX.test(value) || CSS_VAR_COLOR_REGEX.test(value))

/**
 * Parse a `colorGradientDirection` value into an angle in degrees.
 * Accepts a finite number or a `"<n>"`/`"<n>deg"` string; falls back to the default angle otherwise.
 *
 * @param {string | number} value - The raw direction value.
 * @returns {number} The resolved angle in degrees.
 */
export const parseGradientDirection = (value: string | number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const match = /^\s*(-?\d+(?:\.\d+)?)(?:deg)?\s*$/i.exec(value)
    if (match) {
      return Number(match[1])
    }
  }
  return DEFAULT_GRADIENT_ANGLE
}

/**
 * Compute `<linearGradient>` endpoint coordinates for the given CSS angle across the `0 0 24 24` viewBox.
 * Uses the CSS `linear-gradient()` convention: `0deg` points up, angle increases clockwise.
 *
 * @param {number} angleDegrees - The gradient angle in degrees.
 * @returns {Pick<ColorGradient, 'x1' | 'y1' | 'x2' | 'y2'>} The gradient line endpoints in user space.
 */
export const computeGradientCoordinates = (angleDegrees: number): Pick<ColorGradient, 'x1' | 'y1' | 'x2' | 'y2'> => {
  const radians = (angleDegrees * Math.PI) / 180
  const dx = Math.sin(radians)
  const dy = -Math.cos(radians)
  const half = 12
  /** Round to 4 decimal places and drop any trailing zeros for a clean coordinate string. */
  const format = (value: number): string => String(Math.round(value * 10000) / 10000)

  return {
    x1: format(half - dx * half),
    y1: format(half - dy * half),
    x2: format(half + dx * half),
    y2: format(half + dy * half),
  }
}

/**
 * Generate an `id` for a `<linearGradient>` element. By default the id includes a random suffix so that
 * multiple gradient icons on the same page do not collide.
 *
 * @param {boolean} [staticId] - When true, returns the stable base id (used for snapshot testing).
 * @returns {string} The gradient element id.
 */
export const createGradientId = (staticId = false): string =>
  staticId ? GRADIENT_ID_BASE : `${GRADIENT_ID_BASE}-${Math.random().toString(36).substring(2, 12)}`

/**
 * Resolve gradient inputs into a validated {@link ColorGradient} definition.
 * Returns `null` when either color is missing or invalid.
 *
 * @param {object} params - The gradient inputs.
 * @param {string} params.id - The unique id to assign to the generated `<linearGradient>`.
 * @param {string} params.start - The raw gradient start color.
 * @param {string} params.stop - The raw gradient stop color.
 * @param {string | number} params.direction - The raw gradient direction (CSS angle).
 * @returns {ColorGradient | null} The resolved gradient, or `null` if the colors are invalid.
 */
export const resolveColorGradient = (params: {
  id: string
  start: string
  stop: string
  direction: string | number
}): ColorGradient | null => {
  const start = typeof params.start === 'string' ? params.start.trim() : ''
  const stop = typeof params.stop === 'string' ? params.stop.trim() : ''

  if (!isValidGradientColor(start) || !isValidGradientColor(stop)) {
    return null
  }

  return {
    id: params.id,
    start,
    stop,
    ...computeGradientCoordinates(parseGradientDirection(params.direction)),
  }
}

/**
 * Returns true if a `fill` value should be repointed to the generated gradient.
 * Only `currentColor` (single-color icons) and existing gradient references (`url(#…)`, e.g. Kong's
 * `*-gradient` icons) are repointed. Explicit colors — the intentional palettes of multi-color icons —
 * and `fill="none"` are left untouched so multi-color artwork is not flattened.
 *
 * @param {string} fillValue - The raw `fill` attribute value.
 * @returns {boolean} Whether the fill should be repointed.
 */
const isRepointableFill = (fillValue: string): boolean => {
  const value = fillValue.trim()
  return value.toLowerCase() === 'currentcolor' || /^url\(#/i.test(value)
}

/**
 * Apply a generated linear gradient to an SVG content string.
 * Repoints only `currentColor` and existing gradient (`url(#…)`) fills — leaving explicit colors and
 * `fill="none"` untouched — then appends the gradient definition. If the icon has no repointable fills
 * (e.g. a multi-color logo with an explicit palette), the SVG is returned unchanged with no definition added.
 * Fills inside `<defs>`, `<mask>`, and `<clipPath>` are always preserved so clip/mask geometry is not altered.
 *
 * @param {string} svgString - The raw SVG inner HTML.
 * @param {ColorGradient} gradient - The resolved gradient definition to apply.
 * @returns {string} The SVG inner HTML with repointable fills recolored and the gradient definition appended, or the original string if nothing was repointable.
 */
export const applyColorGradient = (svgString: string, gradient: ColorGradient): string => {
  const protectedBlocks: string[] = []

  // Protect <defs>/<mask>/<clipPath> blocks so their internal fills are never repointed
  const withoutProtected = svgString.replace(/<(defs|mask|clipPath)\b[\s\S]*?<\/\1>/gi, (match) => {
    protectedBlocks.push(match)
    return `%%KONG_ICON_GRADIENT_PROTECTED_${protectedBlocks.length - 1}%%`
  })

  // Repoint only `currentColor` and existing gradient (`url(#…)`) fills to the generated gradient
  let didRepoint = false
  const repointed = withoutProtected.replace(/fill="([^"]*)"/g, (match, value: string) => {
    if (!isRepointableFill(value)) {
      return match
    }
    didRepoint = true
    return `fill="url(#${gradient.id})"`
  })

  // If nothing was repointable (e.g. a multi-color logo), leave the icon exactly as-is
  if (!didRepoint) {
    return svgString
  }

  // Restore the protected blocks
  const restored = repointed.replace(/%%KONG_ICON_GRADIENT_PROTECTED_(\d+)%%/g, (_match, index: string) => protectedBlocks[Number(index)])

  const gradientDefinition = `<defs><linearGradient id="${gradient.id}" gradientUnits="userSpaceOnUse" x1="${gradient.x1}" y1="${gradient.y1}" x2="${gradient.x2}" y2="${gradient.y2}"><stop stop-color="${gradient.start}"/><stop offset="1" stop-color="${gradient.stop}"/></linearGradient></defs>`

  return `${restored}${gradientDefinition}`
}
