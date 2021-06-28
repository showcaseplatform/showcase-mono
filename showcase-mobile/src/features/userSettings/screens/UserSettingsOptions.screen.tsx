import React from 'react'
import { Alert, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Divider, TouchableRipple } from 'react-native-paper'
import { RouteProp, NavigationProp } from '@react-navigation/native'

import { UserSettingsStackParamList } from '../../../infrastructure/navigation/userSettings.navigator'
import { translate } from '../../../utils/translator'
import useLogout from '../../../hooks/api/useLogout'

import { Text } from '../../../components/Text.component'
import { Spacer } from '../../../components/Spacer.component'

type UserSettingsOptionsScreenProps = {
  route: RouteProp<UserSettingsStackParamList, 'UserSettingsOptions'>
  navigation: NavigationProp<UserSettingsStackParamList>
}

// todo: memo me?
const optionItems: {
  label: string
  iconName: React.ComponentProps<typeof Ionicons>['name']
  target?: keyof UserSettingsStackParamList
}[] = [
  {
    label: 'Payment Method',
    iconName: 'ios-card-outline',
    target: 'PaymentMethods',
  },
  {
    label: 'Account Balance',
    iconName: 'ios-cash-outline',
    target: 'Wallet',
  },
  {
    label: 'Data Backup',
    iconName: 'ios-archive-outline',
    target: 'DataBackup',
  },
  {
    label: 'Terms of Use',
    iconName: 'document-text-outline',
    target: 'Terms',
  },
  {
    label: 'Privacy Policy',
    iconName: 'ios-finger-print-outline',
    target: 'PaymentMethods',
  },
  {
    label: 'Support',
    iconName: 'ios-help-buoy-outline',
  },
]

const UserSettingsOptionsScreen = ({
  navigation,
}: UserSettingsOptionsScreenProps) => {
  const onLogout = useLogout() // ?: logout fn is TBD

  const handleLogout = () => {
    onLogout()
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {optionItems.map((o) => (
        <TouchableRipple
          onPress={() => {
            if (o.target) {
              navigation.navigate(o.target)
            } else {
              Alert.alert('send email os dialog kicks in')
            }
          }}
          key={o.label}
        >
          <View flexDirection="row" alignItems="center">
            <Spacer position="all" size="large">
              <Ionicons name={o.iconName} size={24} />
            </Spacer>
            <Text variant="label">{o.label}</Text>
          </View>
        </TouchableRipple>
      ))}
      <Divider />
      <TouchableRipple onPress={handleLogout}>
        <View flexDirection="row" alignItems="center">
          <Spacer position="all" size="large">
            <Ionicons name="ios-log-out-outline" size={24} />
          </Spacer>
          <Text variant="label">{translate().profileOptionsLogout}</Text>
        </View>
      </TouchableRipple>
    </View>
  )
}

export default UserSettingsOptionsScreen
