import * as Linking from 'expo-linking'

// ?: how to test locally: `npx uri-scheme open exp://192.168.1.101:19001/--/chat --ios` make sure the address is valid
// ?: how to test builded: `npx uri-scheme open showcase://chat --ios` make sure the app name equal with app.json - scheme
const prefix = Linking.makeUrl('/')

export const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      BadgeNavigator: {
        screens: {
          Profile: 'Profile/:userId',
        },
      },
      Notifications: 'notifications',
      Trade: 'trade',
      Social: 'Social',
      Showcase: 'showcase',
    },
  },
}
