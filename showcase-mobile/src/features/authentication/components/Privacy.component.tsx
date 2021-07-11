import React from 'react'
import { ScrollView } from 'react-native'
import { BottomSheetWrapper } from '../../../components/ScreenWrapper.component'
import { Text } from '../../../components/Text.component'
import { translate } from '../../../utils/translator'

import BottomSheetHeader from './BottomSheetHeader.component'

const Privacy = ({ onBack }: { onBack: () => void }) => (
  <BottomSheetWrapper>
    <BottomSheetHeader title="privacyHeader" onBack={onBack} />
    <ScrollView keyboardShouldPersistTaps="handled" style={{ height: '100%' }}>
      <Text size="caption">{translate().privacyPolicy}</Text>
    </ScrollView>
  </BottomSheetWrapper>
)

export default Privacy
