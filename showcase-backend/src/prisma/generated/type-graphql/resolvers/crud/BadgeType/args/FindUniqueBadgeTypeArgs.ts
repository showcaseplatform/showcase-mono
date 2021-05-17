import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { BadgeTypeWhereUniqueInput } from "../../../inputs/BadgeTypeWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueBadgeTypeArgs {
  @TypeGraphQL.Field(_type => BadgeTypeWhereUniqueInput, {
    nullable: false
  })
  where!: BadgeTypeWhereUniqueInput;
}
