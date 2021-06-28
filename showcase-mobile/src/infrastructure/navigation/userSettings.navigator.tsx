import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import UserDataBackupScreen from '../../features/userSettings/screens/UserDataBackup.screen'
import UserPaymentMethodsScreen from '../../features/userSettings/screens/UserPaymentMethods.screen'
import UserPrivacyScreen from '../../features/userSettings/screens/UserPrivacy.screen'
import UserSettingsOptionsScreen from '../../features/userSettings/screens/UserSettingsOptions.screen'
import UserTermsScreen from '../../features/userSettings/screens/UserTerms.screen'
import UserWalletScreen from '../../features/userSettings/screens/UserWallet.screen'

const UserSettingsStack = createStackNavigator<UserSettingsStackParamList>()

export type UserSettingsStackParamList = {
  UserSettingsOptions: undefined
  PaymentMethods: undefined
  EditPaymentMethod: {
    cardId: string
  }
  Wallet: undefined
  DataBackup: undefined // originally 2 screens, but imo would be better to intergrate into 1
  Terms: undefined
  Privacy: undefined
}

const screenOptions = {
  headerBackTitleVisible: false,
  headerTintColor: '#000',
}

const UserSettingsNavigator = () => {
  return (
    <UserSettingsStack.Navigator screenOptions={screenOptions}>
      <UserSettingsStack.Screen
        name="UserSettingsOptions"
        component={UserSettingsOptionsScreen}
        options={() => ({
          title: 'Options',
        })}
      />
      <UserSettingsStack.Screen
        name="PaymentMethods"
        component={UserPaymentMethodsScreen}
        options={() => ({
          title: 'Your Payment Method',
        })}
      />
      <UserSettingsStack.Screen
        name="Wallet"
        component={UserWalletScreen}
        options={() => ({
          title: 'Wallet',
        })}
      />
      <UserSettingsStack.Screen
        name="DataBackup"
        component={UserDataBackupScreen}
        options={() => ({
          title: 'Data Backup',
        })}
      />
      <UserSettingsStack.Screen
        name="Terms"
        component={UserTermsScreen}
        options={() => ({
          title: 'Terms of Use',
        })}
      />
      <UserSettingsStack.Screen
        name="Privacy"
        component={UserPrivacyScreen}
        options={() => ({
          title: 'Privacy Policy',
        })}
      />
    </UserSettingsStack.Navigator>
  )
}

export default UserSettingsNavigator
