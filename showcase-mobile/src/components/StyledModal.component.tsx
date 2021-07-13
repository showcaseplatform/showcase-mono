import styled from 'styled-components/native'
import { Modal } from 'react-native-paper'

export interface StyledModalProps {
  isOpen: boolean
  closeModal: () => void
}

const StyledModal = styled(Modal).attrs({
  contentContainerStyle: {
    height: '80%',
    width: '84%',
    bottom: '10%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
})`
  align-items: center;
  justify-content: flex-end;
`
export default StyledModal
