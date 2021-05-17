import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { CreateBadgeTypeArgs } from "./args/CreateBadgeTypeArgs";
import { BadgeType } from "../../../models/BadgeType";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => BadgeType)
export class CreateBadgeTypeResolver {
  @TypeGraphQL.Mutation(_returns => BadgeType, {
    nullable: false
  })
  async createBadgeType(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateBadgeTypeArgs): Promise<BadgeType> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).badgeType.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
