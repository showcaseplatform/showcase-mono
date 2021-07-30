import React from 'react'
import { Button, Dialog, Text } from 'react-native-paper'

import theme from '../../../infrastructure/theme'
import {
  useUnlistBadgeItemFromSaleMutation,
  MeDocument,
} from '../../../generated/graphql'

const ConfirmUnlistFromSale = ({
  badgeItemId,
  onClose,
}: {
  badgeItemId: string
  onClose: () => void
}) => {
  const [unlistFromSale, { loading }] = useUnlistBadgeItemFromSaleMutation({
    refetchQueries: [{ query: MeDocument }],
    variables: { badgeItemId },
    onCompleted: () => onClose(),
  })
  return (
    <>
      <Dialog.Title>Unlist from Sale</Dialog.Title>
      <Dialog.Content>
        <Text>Are you sure want to unlist {badgeItemId}?</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          onPress={onClose}
          color={theme.colors.ui.accent}
          contentStyle={{ paddingHorizontal: 8 }}
          uppercase
        >
          cancel
        </Button>
        <Button
          onPress={unlistFromSale}
          mode="contained"
          color={theme.colors.ui.accent}
          style={{ borderRadius: 20 }}
          contentStyle={{ paddingHorizontal: 8 }}
          uppercase
          disabled={loading}
        >
          OK
        </Button>
      </Dialog.Actions>
    </>
  )
}

export default ConfirmUnlistFromSale
