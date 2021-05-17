import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { BadgeTypeWhereInput } from "../../../inputs/BadgeTypeWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyBadgeTypeArgs {
  @TypeGraphQL.Field(_type => BadgeTypeWhereInput, {
    nullable: true
  })
  where?: BadgeTypeWhereInput | undefined;
}
