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
        gt: periodStartDate
      }
    },
    include: {
      badgeItem: {
        include: {
          badgeType: true
        }
      }
    }
  })
}

const getSummaryOfSoldBadgesByCreators = (
  receipts: (Receipt & {
    badgeItem: BadgeItem & {
      badgeType: BadgeType;
  };
})[]
): Record<Uid, BadgesSoldRecordValue> => {
  return receipts.reduce((acc, curr) => {
    if (acc[curr.badgeItem.badgeType.creatorId]) {
      if (acc[curr.badgeItem.badgeType.creatorId][curr.badgeItem.badgeType.currency]) {
        acc[curr.badgeItem.badgeType.creatorId][curr.badgeItem.badgeType.currency] += curr.badgeItem.badgeType.price
      } else {
        acc[curr.badgeItem.badgeType.creatorId][curr.badgeItem.badgeType.currency] = curr.badgeItem.badgeType.price
      }
      acc[curr.badgeItem.badgeType.creatorId].count += 1
    } else {
      acc[curr.badgeItem.badgeType.creatorId] = { [curr.badgeItem.badgeType.currency]: curr.badgeItem.badgeType.price }
      acc[curr.badgeItem.badgeType.creatorId].count = 1
    }
    return acc
  }, {} as any)
}

const getMessagesForCreators = async (dictionary: Record<Uid, BadgesSoldRecordValue>) => {
  let inputMessages: SendNotificationProps[] = []
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
