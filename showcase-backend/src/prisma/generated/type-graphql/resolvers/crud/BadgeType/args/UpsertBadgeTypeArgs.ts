import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { BadgeTypeCreateInput } from "../../../inputs/BadgeTypeCreateInput";
import { BadgeTypeUpdateInput } from "../../../inputs/BadgeTypeUpdateInput";
import { BadgeTypeWhereUniqueInput } from "../../../inputs/BadgeTypeWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertBadgeTypeArgs {
  @TypeGraphQL.Field(_type => BadgeTypeWhereUniqueInput, {
    nullable: false
  })
  where!: BadgeTypeWhereUniqueInput;

  @TypeGraphQL.Field(_type => BadgeTypeCreateInput, {
    nullable: false
  })
  create!: BadgeTypeCreateInput;

  @TypeGraphQL.Field(_type => BadgeTypeUpdateInput, {
    nullable: false
  })
  update!: BadgeTypeUpdateInput;
}
