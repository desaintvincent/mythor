import Color from '../color/Color'

export interface ColorableOptions {
  color: Color
}

interface RotatableOptions {
  rotation: number
}

interface WidthOptions {
  width: number
}

interface StrokeOptions extends ColorableOptions, WidthOptions {
  diagonal: boolean
}

export type LineOptions = ColorableOptions & WidthOptions
export type StrokePolyOptions = RotatableOptions & StrokeOptions
export type FillPolyOptions = RotatableOptions & ColorableOptions
export type CircleOptions = RotatableOptions &
  ColorableOptions &
  WidthOptions & { fill: boolean }
