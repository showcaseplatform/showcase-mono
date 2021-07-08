import {
  NextFn,
  createParamDecorator,
  createMethodDecorator,
} from 'type-graphql'
import { MyContext } from '../../services/apollo'
import { BadgeType, User, BadgeItem } from '@generated/type-graphql'

export const CurrentUser = () => {
  return createParamDecorator<MyContext>(({ context }) => {
    return context.user
  })
}

export const IsCurrentUser = (fallbackType? : null | []) => {
  return createMethodDecorator<MyContext>(async ({ context, root }, next: NextFn) => {
    const isOwnedByCurrentUser = context.user?.id && context.user.id === (root as User).id
    if (isOwnedByCurrentUser) {
      return await next()
    } else {
      return fallbackType || null
    }
  })
}

// todo: not used atm, delete if cant be used anywhere
// export const IsBadgeTypeCreatedByCurrentUser = (fallbackType? : null | []) => {
//   return createMethodDecorator<MyContext>(async ({ context, root }, next: NextFn) => {
//     const isCreatedByCurrentUser = context.user?.id && context.user.id === (root as BadgeType).creatorId
//     if (isCreatedByCurrentUser) {
//       return await next()
//     } else {
//       return fallbackType || null
//     }
//   })
// }

export const IsBadgeItemOwnedByCurrentUser = (fallbackType? : null | []) => {
  return createMethodDecorator<MyContext>(async ({ context, root }, next: NextFn) => {
    const isOwnedByCurrentUser = context.user?.id && context.user.id === (root as BadgeItem).ownerId
    if (isOwnedByCurrentUser) {
      return await next()
    } else {
      return fallbackType || null
    }
  })
}