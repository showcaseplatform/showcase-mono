import { SafeAreaView, StatusBar } from 'react-native'
import { Searchbar } from 'react-native-paper'
import styled from 'styled-components/native'

export const StyledSafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  ${StatusBar.currentHeight && `margin-top: ${StatusBar.currentHeight}px`}
`

export const SearchContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.space[3]};
  padding-bottom: ${({ theme }) => theme.space[2]};
`

export const StyledSearchbar = styled(Searchbar)`
  border-radius: ${({ theme }) => theme.space[1]};
`
