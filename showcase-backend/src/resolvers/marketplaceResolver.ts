import { Resolver, Mutation, Arg, Authorized } from 'type-graphql'
import { BadgeType, BadgeItem } from '@generated/type-graphql'

import { publishBadgeType, uploadBadge } from '../libs/badge/publishBadgeType'
import { PublishBadgeTypeInput } from '../libs/badge/types/publishBadgeType.type'
import { PurchaseBadgeInput } from '../libs/badge/types/purchaseBadge.type'
import { purchaseBadge } from '../libs/badge/purchaseBadge'
import { UserType } from '.prisma/client'
import { User } from '@prisma/client'
import { CurrentUser } from '../libs/auth/decorators'
import { GraphQLError } from 'graphql'
import { FileUpload } from '../types/fileUpload'

@Resolver()
export class MarketplaceResolver {
  @Authorized(UserType.creator)
  @Mutation((_returns) => BadgeType)
  async publishBadgeType(
    @Arg('file') file: FileUpload,
    @Arg('data') publishBadgeTypeInput: PublishBadgeTypeInput,
    @CurrentUser() currentUser: User
  ): Promise<BadgeType> {
    const { uploadedFile, hash } = await uploadBadge(file)
    if (!uploadedFile) throw new GraphQLError('something went wrong with fileupload')

    return publishBadgeType(publishBadgeTypeInput, hash, currentUser)
  }

  @Authorized(UserType.basic, UserType.creator)
  @Mutation((_returns) => BadgeItem)
  async purchaseBadge(
    @Arg('data') purchaseBadgeInput: PurchaseBadgeInput,
    @CurrentUser() currentUser: User
  ): Promise<BadgeItem> {
    return await purchaseBadge(purchaseBadgeInput, currentUser.id)
  }
}
