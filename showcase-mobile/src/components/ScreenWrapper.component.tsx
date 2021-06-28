import styled from 'styled-components/native'

const ScreenWrapper = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  padding-horizontal: ${({ theme }) => theme.space[2]};
`

const BottomSheetWrapper = styled(ScreenWrapper)`
  border-top-left-radius: ${({ theme }) => theme.sizes[2]};
  border-top-right-radius: ${({ theme }) => theme.sizes[2]};
`
export { ScreenWrapper, BottomSheetWrapper }
