import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styled from 'styled-components/native'

const MyKeyboardAwareScrollView = styled(KeyboardAwareScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
})`
  background-color: ${({ theme }) => theme.colors.bg.primary};
`
export default MyKeyboardAwareScrollView
