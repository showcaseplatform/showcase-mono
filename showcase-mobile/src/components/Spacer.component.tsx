import React from 'react'
import styled, { useTheme } from 'styled-components/native'

enum SizeVariant {
  small,
  medium,
  large,
}
enum PositionVariant {
  top,
  left,
  right,
  bottom,
  x,
  y,
  all,
}

const sizeVariant: { [key in keyof typeof SizeVariant]: number } = {
  small: 1,
  medium: 2,
  large: 3,
}
const positionVariant: { [key in keyof typeof PositionVariant]: string } = {
  top: 'marginTop',
  left: 'marginLeft',
  right: 'marginRight',
  bottom: 'marginBottom',
  x: 'marginHorizontal',
  y: 'marginVertical',
  all: 'margin',
}

const getVariant = (
  position: PositionVariant,
  size: SizeVariant,
  theme: any
) => {
  const sizeIndex = sizeVariant[size]
  const property = positionVariant[position]
  const value = theme.space[sizeIndex]

  return `${property}:${value}`
}

const SpacerView = styled.View<{ variant: string }>`
  ${({ variant }) => variant}
`

// TODO: type me properly
type SpacerProps = {
  position: string
  size: string
  children?: React.ReactNode
}

export const Spacer = ({ position, size, children, ...rest }: SpacerProps) => {
  const theme = useTheme()
  const variant = getVariant(position, size, theme)

  return (
    <SpacerView variant={variant} {...rest}>
      {children}
    </SpacerView>
  )
}

Spacer.defaultProps = {
  position: 'top',
  size: 'small',
}
