/**
 * Approximates the on-screen pixel width of a string rendered with the
 * renderer's default bitmap font (see `generateFontTexture` in
 * `@mythor/renderer`), so `createButton`/`createLabel` can center text
 * without needing access to the (asynchronously loaded) actual font glyphs.
 *
 * The default font is generated from the `monospace` CSS font family at
 * `fontSize=100` then displayed at `fontScale=0.2` — this mirrors that same
 * measurement (`monospace`, size 100) with `CanvasRenderingContext2D
 * .measureText`, then applies the same `0.2` scale factor, entirely
 * synchronously. Only accurate for the default font: a custom `Font` with a
 * different family/size/scale will not measure correctly with this helper.
 */
import { Vec2 } from '@mythor/math'

const MEASUREMENT_FONT_SIZE = 100
const DEFAULT_FONT_SCALE = 0.2

let measurementContext: CanvasRenderingContext2D | null | undefined

function getMeasurementContext(): CanvasRenderingContext2D | null {
  if (measurementContext === undefined) {
    measurementContext = document.createElement('canvas').getContext('2d')
  }

  return measurementContext
}

function measureDefaultFontTextWidth(str: string): number {
  const ctx = getMeasurementContext()

  if (!ctx) {
    // Fallback estimate when Canvas2D isn't available (e.g. some test
    // environments): assume a reasonably average monospace character width.
    return str.length * MEASUREMENT_FONT_SIZE * 0.6 * DEFAULT_FONT_SCALE
  }

  ctx.font = `${MEASUREMENT_FONT_SIZE}px monospace`

  return ctx.measureText(str).width * DEFAULT_FONT_SCALE
}

/**
 * The `Text` shader draws each glyph as a quad *centered* on its pen
 * position both horizontally and vertically (see `Sprite`/`Text` shaders'
 * `-0.5..0.5` instanced quad, same convention as `FillRect`), and advances
 * the pen by one glyph width per character *before* moving to the next one.
 * So the whole string's visual center sits at
 * `position + totalWidth / 2 - averageCharWidth / 2` horizontally, and
 * directly at `position` vertically (no vertical offset needed — a single
 * line of text is already vertically centered on its own pen position).
 * This returns the `RenderedText.offset` needed to make the text centered
 * on its entity's `Transform.position`.
 */
export function getCenteredLabelOffset(str: string): Vec2 {
  if (str.length === 0) {
    return Vec2.zero()
  }

  const width = measureDefaultFontTextWidth(str)
  const averageCharWidth = width / str.length

  return Vec2.create(-(width - averageCharWidth) / 2, 0)
}
