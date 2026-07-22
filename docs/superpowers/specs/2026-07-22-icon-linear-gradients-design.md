# Dynamic linear-gradient override for icons

**Date:** 2026-07-22
**Status:** Approved for implementation

## Summary

Add an opt-in ability to apply a dynamically generated `<linearGradient>` to any icon
in the `@kong/icons` library. When a valid start and stop color are provided, the icon's
fills are repainted with the generated gradient — overriding an existing gradient, or
adding one to an icon that has none. When the feature is not used (or values are invalid),
icons render exactly as they do today.

Because every generated component is produced from a single shared template
(`src/__template__/ComponentTemplate.vue`), the props and runtime transform are added
**once** and propagate to all ~563 source icons on `pnpm generate`.

## API

Three new optional props on every icon component:

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `colorGradientStart` | `String` | `''` | Gradient start color: hex, `rgb()/rgba()`, or `var(--…)` |
| `colorGradientStop` | `String` | `''` | Gradient stop/end color: same accepted formats |
| `colorGradientDirection` | `String \| Number` | `'135deg'` | Standard CSS gradient angle. Number or `"<n>deg"` string. Invalid → default. |

**Activation rule:** the gradient applies **only when both** `colorGradientStart` and
`colorGradientStop` are present and valid. Otherwise no gradient is applied and the icon
renders unchanged. Fully backward-compatible.

**Flag icons are always excluded:** gradients are never applied to `flag` icons (they must retain
their official colors). Each generated component knows its own type via an injected
`{%%KONG_COMPONENT_ICON_TYPE%%}` placeholder (`solid` | `multi-color` | `flags`); when the type is
`flags` the gradient is skipped and a dev-only `console.warn` is emitted if colors were provided.

## Validation & fallback (fail-safe)

- **Color validation** accepts:
  - hex: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`
  - `rgb()` / `rgba()`
  - `var(--custom-prop[, fallback])` (reuses the existing `isCssVar` regex)
- **Direction validation** accepts a finite number, or a `"<n>deg"` string. Anything else
  falls back to the `135deg` default.
- Validators use anchored regexes, which also sanitize values before they are injected
  into the `v-html` SVG string (only well-formed color tokens can reach the markup).
- On any missing/invalid **color**: no gradient, render the normal icon, and emit a
  dev-only `console.warn` naming the offending prop/value. Never blanks or breaks an icon.

## Module structure

The gradient logic lives in dedicated, unit-tested modules rather than inline in the template:

- `src/types/color-gradient.ts` — the `ColorGradient` interface.
- `src/utils/color-gradient.ts` — pure functions: `isValidGradientColor`, `parseGradientDirection`,
  `computeGradientCoordinates`, `createGradientId`, `resolveColorGradient`, and `applyColorGradient`.
- `src/utils/color-gradient.spec.ts` — unit tests for the above (imported via the `@/` alias).

The template imports these via the `@/` path alias (resolves for `vue-tsc`, Vitest, and the Vite lib
build alike), keeping the component thin: it resolves the gradient in a computed and warns on invalid input.

### Dynamic gradient id

`createGradientId()` returns `kong-icon-gradient-<random>` so multiple gradient icons on the same page do
not collide, mirroring `prefixSvgIdsInString`. Under `staticIds: true` (snapshot testing) it returns the
stable base id `kong-icon-gradient`. The id is generated once per component instance and stored on the
`ColorGradient`; `applyColorGradient` uses `gradient.id` for both the `<linearGradient id>` and the `url(#…)`
fill references. (The existing ID-prefixing still runs afterward for non-static renders, which is harmless.)

## Runtime transform

Implemented in the util's `applyColorGradient`, called from the template's computed content **before** the
existing `prefixSvgIdsInString` step. When the gradient is active:

1. **Compute endpoints** — from `colorGradientDirection`, using the standard CSS
   `linear-gradient` angle convention (`0deg` = upward, clockwise; `90deg` = right;
   `180deg` = down), mapped across the `0 0 24 24` viewBox. Default `135deg` = to
   bottom-right, matching Kong's existing `*-gradient` icons.
2. **Inject** a `<defs><linearGradient id="kong-icon-gradient" gradientUnits="userSpaceOnUse"
   x1 y1 x2 y2><stop offset="0" .../><stop offset="1" .../></linearGradient></defs>`.
   `userSpaceOnUse` gives one consistent gradient across the whole icon rather than
   per-path.
3. **Repoint fills** — every `fill="…"` whose value is not `none` is replaced with
   `fill="url(#kong-icon-gradient)"`. This overrides `currentColor` (solid icons), flat
   fills (multi-color), and existing `url(#paint…)` references (the 23 gradient icons).
   `fill="none"` and all `stroke` values are left untouched.
4. The existing ID-prefixing then runs, giving the injected `id`/`url(#…)` the same unique
   prefix as the rest of the SVG (no collision handling needed). Under `staticIds: true`
   the id remains the stable `kong-icon-gradient`.

### Scope note (Option A)

Gradients apply to **fills** only. Of the 563 source icons, 100% have a fillable shape and
0 are stroke-only, so there are no no-op icons today. Stroke-only icons (none currently
exist) would be unaffected — a documented, low-risk boundary.

## Preview (sandbox only)

A global controls bar in the sandbox `PageHeader`: start-color, stop-color, and direction
inputs, plus a clear/reset. Values are wired through `HomePage` → `SandboxIcon` → each icon
component and applied live to the entire icon grid at once, for a library-wide visual read.
Not shipped in the published package.

## Test coverage

Extends `src/tests/generated-component.spec.ts`. The existing default-props snapshot test is
unchanged (so the 563 committed snapshots do not change). A new `color gradient` describe
block runs functional assertions per-component (`staticIds: true`):

- both colors valid → exactly one injected `<linearGradient id="kong-icon-gradient">`, all
  non-`none` fills repointed to `url(#kong-icon-gradient)`, `fill="none"` untouched.
- existing-gradient icon → original fills now reference the injected gradient.
- only one color / invalid color → no gradient, output identical to baseline, `console.warn`
  emitted (spied).
- invalid direction → falls back to default (no warn required), gradient still applied.
- direction angle vs `"<n>deg"` string produce the expected `x1/y1/x2/y2`.
- `var(--…)`, `rgb()`, and hex all accepted as colors.

## Files touched

- `src/types/color-gradient.ts` — the `ColorGradient` interface (new).
- `src/utils/color-gradient.ts` — pure gradient logic (new).
- `src/utils/color-gradient.spec.ts` — unit tests for the util (new).
- `src/__template__/ComponentTemplate.vue` — props + thin wiring to the util.
- `tsconfig.build.json` — exclude `src/**/*.spec.ts` from the declaration build.
- `sandbox/components/PageHeader.vue`, `sandbox/pages/HomePage.vue`,
  `sandbox/components/SandboxIcon.vue` — preview controls.
- `src/tests/generated-component.spec.ts` — component integration coverage.
- `README.md` — document the three props and fail-safe behavior.

## Out of scope (YAGNI)

- Direction keywords (`to-right`, etc.) — angle-only.
- Multi-stop (3+) gradients, radial gradients.
- Gradient on strokes.
- Per-icon sandbox controls; dedicated playground route.
