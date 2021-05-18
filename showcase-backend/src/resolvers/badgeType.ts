import * as TypeGraphQL from 'type-graphql'
import graphqlFields from 'graphql-fields'
import { GraphQLResolveInfo } from 'graphql'
import { BadgeType, FindUniqueBadgeTypeArgs } from '@generated/type-graphql'
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from '@generated/type-graphql/helpers'

transformFields

@TypeGraphQL.Resolver((_of) => BadgeType)
export class FindUniqueBadgeTypeResolver {
  @TypeGraphQL.Query((_returns) => BadgeType, {
    nullable: true,
  })
  async badgeType(
    @TypeGraphQL.Ctx() ctx: any,
    @TypeGraphQL.Info() info: GraphQLResolveInfo,
    @TypeGraphQL.Args() args: FindUniqueBadgeTypeArgs
  ): Promise<BadgeType | null> {
    const { _count } = transformFields(graphqlFields(info as any))
    return getPrismaFromContext(ctx).badgeType.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    })
  }
}
