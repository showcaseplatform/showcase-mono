import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { BadgeTypeUpdateInput } from "../../../inputs/BadgeTypeUpdateInput";
import { BadgeTypeWhereUniqueInput } from "../../../inputs/BadgeTypeWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateBadgeTypeArgs {
  @TypeGraphQL.Field(_type => BadgeTypeUpdateInput, {
    nullable: false
  })
  data!: BadgeTypeUpdateInput;

  @TypeGraphQL.Field(_type => BadgeTypeWhereUniqueInput, {
    nullable: false
  })
  where!: BadgeTypeWhereUniqueInput;
}
