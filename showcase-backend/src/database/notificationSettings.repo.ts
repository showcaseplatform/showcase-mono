import { NotificationType } from '.prisma/client'
import { NotificationSettings } from '@prisma/client'
import prisma from '../services/prisma'

export const findUserNotificationSettings = async (id: string) => {
  return await prisma.notificationSettings.findMany({
    where: {
      id,
    },
  })
}

export const findUniqueNotificationSettings = async (id: string, type: NotificationType) => {
  return await prisma.notificationSettings.findUnique({
    where: {
      id_type: {
        id,
        type,
      },
    },
  })
}

export const upsertNotifcationSettings = async (settings: NotificationSettings) => {
  const { id, ...rest } = settings
  return await prisma.notificationSettings.upsert({
    where: {
      id_type: {
        id,
        type: rest.type,
      },
    },
    create: {
      id,
      ...rest,
    },
    update: {
      ...rest,
    },
  })
}
