import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { DeleteBadgeTypeArgs } from "./args/DeleteBadgeTypeArgs";
import { BadgeType } from "../../../models/BadgeType";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => BadgeType)
export class DeleteBadgeTypeResolver {
  @TypeGraphQL.Mutation(_returns => BadgeType, {
    nullable: true
  })
  async deleteBadgeType(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteBadgeTypeArgs): Promise<BadgeType | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).badgeType.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
