import {
  NextFn,
  createParamDecorator,
  createMethodDecorator,
} from 'type-graphql'
import { MyContext } from '../../services/apollo'
import { User, BadgeItem } from '@generated/type-graphql'

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

export const IsBadgeItemOwnedOrCreatedByCurrentUser = (fallbackType? : null | []) => {
  return createMethodDecorator<MyContext>(async ({ context, root }, next: NextFn) => {
    const isOwnedByCurrentUser = context.user?.id && context.user.id === (root as BadgeItem).ownerId
    const isCreatedByCurrentUser = context.user?.id && context.user.id === (root as BadgeItem)?.badgeType?.creatorId
    if (isOwnedByCurrentUser || isCreatedByCurrentUser) {
      return await next()
    } else {
      return fallbackType || null
    }
  })
}