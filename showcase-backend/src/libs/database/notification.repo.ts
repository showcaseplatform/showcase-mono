import { NotificationType } from '.prisma/client'
import prisma from '../../services/prisma'
import { Uid } from '../../types/user'

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
