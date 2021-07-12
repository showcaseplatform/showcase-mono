import moment from 'moment'
import { Uid } from '../../types/user'
import { notificationSender } from '../notification/notificationSenderLib'
import { NotificationType } from '.prisma/client'
import { SendNotificationProps } from '../../types/notificaton'
import prisma from '../../services/prisma'
import { BadgeType, Receipt, BadgeItem } from '@prisma/client'

// todo: currently this notification is not used
interface BadgesSoldRecordValue {
  USD: number
  GBP: number
  EUR: number
  count: number
}

const getAllReceiptsFromLastWeek = async () => {
  const periodStartDate = moment().add(-7, 'days').toDate()
  return await prisma.receipt.findMany({
    where: {
      createdAt: {
        gt: periodStartDate,
      },
    },
    include: {
      badgeItem: {
        include: {
          badgeType: true,
        },
      },
    },
  })
}

const getSummaryOfSoldBadgesByCreators = (
  receipts: (Receipt & {
    badgeItem: BadgeItem & {
      badgeType: BadgeType
    }
  })[]
): Record<Uid, BadgesSoldRecordValue> => {
  return receipts.reduce<Record<Uid, BadgesSoldRecordValue>>((acc, curr) => {
    const {
      badgeItem: {
        badgeType: { creatorId, currency, price },
      },
    } = curr

    if (acc[creatorId]) {
      if (acc[creatorId][currency]) {
        acc[creatorId][currency] += price
      } else {
        acc[creatorId][currency] = price
      }
      acc[creatorId].count += 1
    } else {
      acc[creatorId][currency] = price
      acc[creatorId].count = 1
    }
    return acc
  }, {})
}

const getMessagesForCreators = async (dictionary: Record<Uid, BadgesSoldRecordValue>) => {
  const inputMessages: SendNotificationProps[] = []
  for (const [uid, value] of Object.entries(dictionary)) {
    const title = `Weekly recap:`
    const message = `You sold ${value.count} badges this week for a total of ${
      value.USD ? '$' + value.USD + ' ' : ''
    }  ${value.EUR ? '€' + value.EUR + ' ' : ''} ${value.GBP ? '£' + value.GBP + ' ' : ''}`

    inputMessages.push({
      type: NotificationType.SOLD_BADGES_SUMMARY,
      recipientId: uid,
      title,
      message,
    })
  }

  return inputMessages
}

export const sendSoldBadgesSummary = async () => {
  const receipts = await getAllReceiptsFromLastWeek()
  const soldBagesSummary = getSummaryOfSoldBadgesByCreators(receipts)
  const inputMessages = await getMessagesForCreators(soldBagesSummary)
  await notificationSender.send(inputMessages)
}
