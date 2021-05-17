import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateBadgeTypeArgs } from "./args/AggregateBadgeTypeArgs";
import { BadgeType } from "../../../models/BadgeType";
import { AggregateBadgeType } from "../../outputs/AggregateBadgeType";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => BadgeType)
export class AggregateBadgeTypeResolver {
  @TypeGraphQL.Query(_returns => AggregateBadgeType, {
    nullable: false
  })
  async aggregateBadgeType(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateBadgeTypeArgs): Promise<AggregateBadgeType> {
    return getPrismaFromContext(ctx).badgeType.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
