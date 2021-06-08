import { UserType } from '@prisma/client'

export const authChecker = ({ context }: any, roles: UserType[]) => {
  const { user } = context
  if (!user) {
    return false
  }
  if (!roles.includes(user.userType)) {
    return false
  }
  return true
}
