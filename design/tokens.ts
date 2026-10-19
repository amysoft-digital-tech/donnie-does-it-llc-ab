/**
 * Design tokens — single source of truth for the visual system.
 *
 * Mirrors §11 of specs/base-spec-astro-starter.md.  Categories: `color`,
 * `font`, `space`, `radius`, `shadow`, `breakpoint`.
 *
 * - `tokens` — the typed, `as const` source-of-truth object.
 * - `tokensCssRootBlock()` — returns a CSS `:root { … }` string suitable for
 *   embedding in a `.css` file; consumed by `scripts/generate-tokens-css.mjs`.
 *
 * Donnie Does It LLC. Brand colors measured from the logo (Facebook profile
 * picture): blue #058BD3 and red #CF3D3A. Greys are tinted toward the blue
 * hue. Web fonts load from fonts.bunny.net (see components.css).
 */

// ---------------------------------------------------------------------------
// Token definitions
// ---------------------------------------------------------------------------

export const tokens = {
  color: {
    fg:          '#122230',
    bg:          '#ffffff',
    muted:       '#566876',
    accent:      '#0a6ea8',
    primary:     '#058bd3',
    primaryDeep: '#0b4f78',
    secondary:   '#cf3d3a',
    surface:     '#f2f6f9',
    line:        '#dbe4eb',
    ink:         '#14304a',
    paper:       '#f7f5ef',
  },
  font: {
    sans:  '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: '"Source Serif 4", "Iowan Old Style", Georgia, "Times New Roman", serif',
    mono:  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  },
  space: {
    xs:   '0.25rem',
    sm:   '0.5rem',
    md:   '1rem',
    lg:   '1.5rem',
    xl:   '2rem',
    '2xl': '3rem',
    '3xl': '4.5rem',
    '4xl': '7rem',
  },
  radius: {
    sm:      '0.375rem',
    DEFAULT: '0.75rem',
    lg:      '1.25rem',
    full:    '999px',
  },
  shadow: {
    sm:      '0 1px 2px 0 rgb(18 34 48 / 0.06)',
    DEFAULT: '0 1px 3px 0 rgb(18 34 48 / 0.08), 0 4px 12px -2px rgb(18 34 48 / 0.08)',
    lg:      '0 2px 6px -1px rgb(18 34 48 / 0.08), 0 18px 40px -12px rgb(18 34 48 / 0.22)',
  },
  /** Pixel values for Tailwind `screens` — CSS var() cannot live inside @media. */
  breakpoint: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const

export type Tokens = typeof tokens

// ---------------------------------------------------------------------------
// CSS :root emitter
// ---------------------------------------------------------------------------

/**
 * Produce a CSS `:root { … }` block string from `tokens`.
 *
 * Naming conventions:
 * - `color.fg`       → `--color-fg`
 * - `font.sans`      → `--font-sans`
 * - `space.xs`       → `--space-xs`
 * - `radius.DEFAULT` → `--radius`   (not `--radius-DEFAULT`)
 * - `shadow.DEFAULT` → `--shadow`   (not `--shadow-DEFAULT`)
 * - `breakpoint.sm`  → `--bp-sm`    (declared for discoverability; Tailwind
 *                                    reads from `tokens` directly at config time)
 *
 * Output is deterministic; lines are grouped by category in definition order.
 */
export function tokensCssRootBlock(): string {
  const lines: string[] = []

  function prop(name: string, value: string): void {
    lines.push(`  ${name}: ${value};`)
  }

  // color
  prop('--color-fg',           tokens.color.fg)
  prop('--color-bg',           tokens.color.bg)
  prop('--color-muted',        tokens.color.muted)
  prop('--color-accent',       tokens.color.accent)
  prop('--color-primary',      tokens.color.primary)
  prop('--color-primary-deep', tokens.color.primaryDeep)
  prop('--color-secondary',    tokens.color.secondary)
  prop('--color-surface',      tokens.color.surface)
  prop('--color-line',         tokens.color.line)
  prop('--color-ink',          tokens.color.ink)
  prop('--color-paper',        tokens.color.paper)

  // font
  prop('--font-sans',  tokens.font.sans)
  prop('--font-serif', tokens.font.serif)
  prop('--font-mono',  tokens.font.mono)

  // space
  prop('--space-xs',  tokens.space.xs)
  prop('--space-sm',  tokens.space.sm)
  prop('--space-md',  tokens.space.md)
  prop('--space-lg',  tokens.space.lg)
  prop('--space-xl',  tokens.space.xl)
  prop('--space-2xl', tokens.space['2xl'])
  prop('--space-3xl', tokens.space['3xl'])
  prop('--space-4xl', tokens.space['4xl'])

  // radius — DEFAULT → --radius (matches Tailwind config convention)
  prop('--radius-sm',   tokens.radius.sm)
  prop('--radius',      tokens.radius.DEFAULT)
  prop('--radius-lg',   tokens.radius.lg)
  prop('--radius-full', tokens.radius.full)

  // shadow — DEFAULT → --shadow
  prop('--shadow-sm', tokens.shadow.sm)
  prop('--shadow',    tokens.shadow.DEFAULT)
  prop('--shadow-lg', tokens.shadow.lg)

  // breakpoints — --bp-* prefix; static px values
  prop('--bp-sm', tokens.breakpoint.sm)
  prop('--bp-md', tokens.breakpoint.md)
  prop('--bp-lg', tokens.breakpoint.lg)
  prop('--bp-xl', tokens.breakpoint.xl)

  return `:root {\n${lines.join('\n')}\n}\n`
}
