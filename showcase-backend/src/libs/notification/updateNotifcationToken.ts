import Expo from 'expo-server-sdk'
import { GraphQLError } from 'graphql'
import prisma from '../../services/prisma'
import { NotificationToken, Uid } from '../../types/user'

export const addNotifcationToken = async (notificationToken: NotificationToken, uid: Uid) => {
  if(Expo.isExpoPushToken(notificationToken)) {
    return await prisma.user.update({
      where: {
        id: uid,
      },
      data: {
        notificationToken,
      },
    })
  } else {
    throw new GraphQLError('Notifcation token is not a valid expo push token.')
  }
}

export const removeNotifcationToken = async (uid: Uid) => {
  return await prisma.user.update({
    where: {
      id: uid,
    },
    data: {
      notificationToken: null,
    },
  })
}
