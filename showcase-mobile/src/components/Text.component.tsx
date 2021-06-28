import styled, { DefaultTheme } from 'styled-components/native'
import { FontSizes, TextColors } from '../../types/styled'

const defaultTextStyles = (theme: DefaultTheme) => `
  font-family: ${theme.fonts.body};
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.text.primary};
  flex-wrap: wrap;
  margin-top: 0px;
  margin-bottom: 0px;
`

const body = (theme: DefaultTheme) => `
  font-size: ${theme.fontSizes.body};
`

const heading = (theme: DefaultTheme) => `
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.h5};
  line-height: ${theme.lineHeights.title}
`

const hint = (theme: DefaultTheme) => `
  font-size: ${theme.fontSizes.body};
  color: ${theme.colors.text.grey};
`

const error = (theme: DefaultTheme) => `
  color: ${theme.colors.text.error};
`

const caption = (theme: DefaultTheme) => `
  font-size: ${theme.fontSizes.caption};
  font-weight: ${theme.fontWeights.bold};
`

const label = (theme: DefaultTheme) => `
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes.body};
  font-weight: ${theme.fontWeights.medium};
`

// temp
const smallBody = (theme: DefaultTheme) => `
font-family: ${theme.fonts.body};
font-size: ${theme.fontSizes.button};
`

// temp
const link = (theme: DefaultTheme) => `
font-family: ${theme.fonts.body};
font-size: ${theme.fontSizes.button};
color: ${theme.colors.text.link};
text-decoration: underline;
`

// todo: type me properly
const variants: { [key: string]: (theme: any) => string } = {
  body,
  label,
  caption,
  error,
  hint,
  heading,
  smallBody,
  link,
}

// todo: clean up this mess asap the rewrite phase is over
export const Text = styled.Text<{
  variant?: string
  color?: keyof TextColors
  center?: boolean
  bold?: boolean
  uppercase?: boolean
}>`
  ${({ theme }) => defaultTextStyles(theme)}
  ${({ variant, theme }) => variants[variant!](theme)}
  ${({ color, theme }) => color && `color:${theme.colors.text[color]}`}
  text-align: ${(props) => (props.center ? 'center' : 'auto')};
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'none')};
  font-family: ${(props) =>
    props.bold ? props.theme.fonts.heading : props.theme.fonts.body};
`

Text.defaultProps = {
  variant: 'body',
}
