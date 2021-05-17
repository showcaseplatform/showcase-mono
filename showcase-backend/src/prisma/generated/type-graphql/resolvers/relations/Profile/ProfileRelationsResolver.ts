import * as TypeGraphQL from "type-graphql";
import { BadgeType } from "../../../models/BadgeType";
import { Profile } from "../../../models/Profile";
import { User } from "../../../models/User";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Profile)
export class ProfileRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => User, {
    nullable: false
  })
  async user(@TypeGraphQL.Root() profile: Profile, @TypeGraphQL.Ctx() ctx: any): Promise<User> {
    return getPrismaFromContext(ctx).profile.findUnique({
      where: {
        id: profile.id,
      },
    }).user({});
  }

  @TypeGraphQL.FieldResolver(_type => BadgeType, {
    nullable: true
  })
  async badgeTypesCreated(@TypeGraphQL.Root() profile: Profile, @TypeGraphQL.Ctx() ctx: any): Promise<BadgeType | null> {
    return getPrismaFromContext(ctx).profile.findUnique({
      where: {
        id: profile.id,
      },
    }).badgeTypesCreated({});
  }

  @TypeGraphQL.FieldResolver(_type => BadgeType, {
    nullable: true
  })
  async badgeTypesOwned(@TypeGraphQL.Root() profile: Profile, @TypeGraphQL.Ctx() ctx: any): Promise<BadgeType | null> {
    return getPrismaFromContext(ctx).profile.findUnique({
      where: {
        id: profile.id,
      },
    }).badgeTypesOwned({});
  }
}
