import * as TypeGraphQL from "type-graphql";
import { BadgeType } from "../../../models/BadgeType";
import { Profile } from "../../../models/Profile";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => BadgeType)
export class BadgeTypeRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Profile, {
    nullable: false
  })
  async creator(@TypeGraphQL.Root() badgeType: BadgeType, @TypeGraphQL.Ctx() ctx: any): Promise<Profile> {
    return getPrismaFromContext(ctx).badgeType.findUnique({
      where: {
        id: badgeType.id,
      },
    }).creator({});
  }

  @TypeGraphQL.FieldResolver(_type => Profile, {
    nullable: false
  })
  async owner(@TypeGraphQL.Root() badgeType: BadgeType, @TypeGraphQL.Ctx() ctx: any): Promise<Profile> {
    return getPrismaFromContext(ctx).badgeType.findUnique({
      where: {
        id: badgeType.id,
      },
    }).owner({});
  }
}
