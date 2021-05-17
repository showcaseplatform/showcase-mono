import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByBadgeTypeArgs } from "./args/GroupByBadgeTypeArgs";
import { BadgeType } from "../../../models/BadgeType";
import { BadgeTypeGroupBy } from "../../outputs/BadgeTypeGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => BadgeType)
export class GroupByBadgeTypeResolver {
  @TypeGraphQL.Query(_returns => [BadgeTypeGroupBy], {
    nullable: false
  })
  async groupByBadgeType(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByBadgeTypeArgs): Promise<BadgeTypeGroupBy[]> {
    const { count, avg, sum, min, max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).badgeType.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ count, avg, sum, min, max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
