import 'styled-components'
import {
  FontSizes,
  FontWeights,
  Fonts,
} from '../src/infrastructure/theme/fonts'
import { Spacing } from '../src/infrastructure/theme/spacing'

export type TextColors = {
  primary: string
  secondary: string
  grey: string
  error: string
  link: string
  accent: string
}

export type Colors = {
  bg: {
    primary: string
    secondary: string
    black: string
  }
  ui: {
    accent: string
    disabled: string
    disabledLight: string
    success: string
    inputBgLight: string
    error: string
  }
  text: TextColors
}

export type Fonts = {
  body: string
  heading: string
}

export type FontWeights = {
  regular: number
  medium: number
  bold: number
}

export type FontSizes = {
  h2: string
  h3: string
  h4: string
  h5: string
  title: string
  body: string
  button: string
  caption: string
}

export type Spacing = string[]

export type LineHeights = {
  title: string
  copy: string
}

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Colors
    sizes: string[]
    space: Spacing
    fonts: Fonts
    fontWeights: FontWeights
    fontSizes: FontSizes
    lineHeights: LineHeights
  }
}
