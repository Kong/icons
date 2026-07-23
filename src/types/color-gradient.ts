/**
 * A resolved, validated linear gradient definition applied to an icon's fills.
 * Produced by `resolveColorGradient` and consumed by `applyColorGradient`.
 */
export interface ColorGradient {
  /** The unique `id` for the generated `<linearGradient>` element (kept unique so multiple icons can coexist on a page) */
  id: string
  /** The validated gradient start (offset `0`) color */
  start: string
  /** The validated gradient stop (offset `1`) color */
  stop: string
  /** The gradient line start `x` coordinate within the `0 0 24 24` viewBox */
  x1: string
  /** The gradient line start `y` coordinate within the `0 0 24 24` viewBox */
  y1: string
  /** The gradient line end `x` coordinate within the `0 0 24 24` viewBox */
  x2: string
  /** The gradient line end `y` coordinate within the `0 0 24 24` viewBox */
  y2: string
}
