import styled from 'styled-components/native'

export const CenterView = styled.View<{ row?: boolean }>`
  justify-content: center;
  align-items: center;
  ${({ row }) => row && 'flex-direction: row'};
`
