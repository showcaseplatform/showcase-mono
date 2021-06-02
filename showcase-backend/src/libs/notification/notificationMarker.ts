import { PrismaClient } from '@prisma/client'
import Bluebird from 'bluebird'
import prisma from '../../services/prisma'
import { Uid } from '../../types/user'
import { MarkerInfo } from './types/notificationMarker.type'

class NotificationMarker {
  private prisma: PrismaClient

  constructor() {
    this.prisma = prisma
  }

  markOneAsRead = async (notificationId: string) => {
    if (this.checkIfNotificationReadAlready(notificationId)) {
      return { info: 'Notifcation marked already' } as MarkerInfo
    }
    return await this.markNotifcationAsRead(notificationId)
  }

  markAllAsRead = async (uid: Uid) => {
    const unreadNotifications = this.findAllUnreadNotifications(uid)
    return await Bluebird.map(unreadNotifications, async ({ id }) => {
      return await this.markNotifcationAsRead(id)
    })
  }

  findAllUnreadNotifications = async (uid: Uid) => {
    return await this.prisma.notification.findMany({
      where: {
        recipientId: uid,
        AND: {
          readAt: null,
        },
      },
    })
  }

  markNotifcationAsRead = async (id: string) => {
    return await this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        readAt: new Date(),
      },
    })
  }

  checkIfNotificationReadAlready = async (id: string) => {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    })

    return !!notification?.readAt
  }
}

export const notificationMarker = new NotificationMarker()
