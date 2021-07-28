import styled from 'styled-components/native'
import { ImageBackground } from 'react-native'

export const MyImageBackground = styled(ImageBackground)`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bg.black};
`

export const MyImage = styled.Image`
  width: 100%;
  height: 100%;
  background-color: transparent;
`

export const InfoWrapper = styled.View`
  position: absolute;
  width: 100%;
  bottom: 5%;
  padding-horizontal: ${({ theme }) => theme.space[2]};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
