import { TouchableOpacity } from '@gorhom/bottom-sheet'
import styled from 'styled-components/native'

export const InlineSubmitButton = styled(TouchableOpacity)<{
  isValid: boolean
}>`
  height: 40px;
  border-radius: 20px;
  width: 40px;
  background-color: ${({ theme, isValid }) =>
    isValid ? theme.colors.ui.accent : theme.colors.ui.disabled};
  justify-content: center;
  align-items: center;
`
