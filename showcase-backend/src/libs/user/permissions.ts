import { User } from '@generated/type-graphql'
import { SPEND_LIMIT_DEFAULT, SPEND_LIMIT_KYC_VERIFIED } from '../../consts/businessRules'
import { Uid } from '../../types/user'
import { findUserWithFinancialInfo } from '../database/user.repo'

export const isUserAllowedToBuy = async (id: Uid): Promise<boolean> => {
  try {
    const user = await findUserWithFinancialInfo(id)
    return hasUserPaymentInfo(user)
  } catch (_) {
    return false
  }
}

export const hasUserReachedSpendingLimit = (user: User): boolean => {
  const spendingLimit = user.kycVerified ? SPEND_LIMIT_KYC_VERIFIED : SPEND_LIMIT_DEFAULT;
  return (user.balance?.totalSpentAmountConvertedUsd || 0) > spendingLimit
}

// todo: improve this validation once we know what paymentInfo should we use
export const hasUserPaymentInfo = (user: User): boolean => {
return !!(user.paymentInfo?.idToken && user.paymentInfo?.lastFourCardDigit)
}
