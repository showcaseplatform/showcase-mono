import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { BadgeTypeCreateInput } from "../../../inputs/BadgeTypeCreateInput";

@TypeGraphQL.ArgsType()
export class CreateBadgeTypeArgs {
  @TypeGraphQL.Field(_type => BadgeTypeCreateInput, {
    nullable: false
  })
  data!: BadgeTypeCreateInput;
}
