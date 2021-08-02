import { NotificationType } from '.prisma/client'
import prisma from '../services/prisma'
import { Uid } from '../types/user'
import { NotificationCreateManyInput } from '@generated/type-graphql'

export const findUserNotificationsFromTypeInPeriod = async (
  uid: Uid,
  type: NotificationType,
  periodStartDate: Date
) => {
  return await prisma.notification.findMany({
    where: {
      recipientId: uid,
      type,
      createdAt: {
        gt: periodStartDate,
      },
    },
  })
}

export const createManyNotifications = async (data: NotificationCreateManyInput[]) => {
  return await prisma.notification.createMany({
    data,
  })
}
