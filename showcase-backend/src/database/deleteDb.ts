import { PrismaClient } from '.prisma/client';

export const cleanDb = async (prisma: PrismaClient) => {
    // add data models WITHOUT dependecies here
    await prisma.badgeItemLike.deleteMany()
    await prisma.badgeItemView.deleteMany()
    await prisma.badgeTypeLike.deleteMany()
    await prisma.badgeTypeView.deleteMany()
    await prisma.profile.deleteMany()
    await prisma.receipt.deleteMany()
    await prisma.badgeItem.deleteMany()
    await prisma.crypto.deleteMany()
    await prisma.balance.deleteMany()
    await prisma.currencyRate.deleteMany()
    await prisma.paymentInfo.deleteMany()
    await prisma.transferwise.deleteMany()
    await prisma.withdrawal.deleteMany()
    await prisma.follow.deleteMany()
    await prisma.expoAdmin.deleteMany()
    await prisma.chatParticipant.deleteMany()
    await prisma.chatMessage.deleteMany()
    await prisma.chatMessageRead.deleteMany()
    await prisma.chatMessageRead.deleteMany()
    await prisma.notificationSettings.deleteMany()
    await prisma.notification.deleteMany()
    
    //add data models WITH dependecies here
    await prisma.cause.deleteMany()
    await prisma.badgeType.deleteMany()
    await prisma.chat.deleteMany()
    await prisma.user.deleteMany()
}