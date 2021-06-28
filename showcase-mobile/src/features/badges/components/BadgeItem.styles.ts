import styled from 'styled-components/native'
import { Surface } from 'react-native-paper'

export const Badge = styled(Surface)<{ flat: boolean }>`
  flex: 1;
  height: undefined;
  aspect-ratio: 1;
  margin-vertical: ${({ theme, flat }) =>
    flat ? theme.space[0] : theme.space[1]};
  margin-horizontal: ${({ theme, flat }) =>
    flat ? theme.space[1] : theme.space[1]};
  background-color: transparent;
  elevation: ${({ flat }) => (flat ? 0 : 4)};
`

export const BadgeImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.space[2]};
`

export const BadgeLabelWrapper = styled.View`
  position: absolute;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`
