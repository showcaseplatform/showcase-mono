import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { ScreenWrapper } from '../../../components/ScreenWrapper.component'
import { translate } from '../../../utils/translator'
import { useMyBottomSheet } from '../../../utils/useMyBottomSheet'

type BottomSheetHeaderProps = {
  title: string
  subtitle?: string
  onBack?: () => void
}

const BottomSheetHeader = ({
  title = 'placeholder title',
  subtitle,
  onBack,
}: BottomSheetHeaderProps) => {
  const { collapse } = useMyBottomSheet()

  return (
    <ScreenWrapper>
      <View flexDirection="row" paddingVertical={10}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{translate()[title]}</Text>
        </View>
        <TouchableOpacity onPress={onBack ?? collapse}>
          <Ionicons
            name={onBack ? 'arrow-back-outline' : 'ios-close'}
            size={36}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {subtitle && (
        <View style={styles.subtitleWrapper}>
          <Text style={styles.bodyText}>{translate()[subtitle]}</Text>
        </View>
      )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  titleWrapper: {
    position: 'absolute',
    marginTop: 10,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitleWrapper: {
    marginTop: 10,
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
})

export default BottomSheetHeader
