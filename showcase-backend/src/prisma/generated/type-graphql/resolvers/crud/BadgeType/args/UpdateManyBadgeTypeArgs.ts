import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { BadgeTypeUpdateManyMutationInput } from "../../../inputs/BadgeTypeUpdateManyMutationInput";
import { BadgeTypeWhereInput } from "../../../inputs/BadgeTypeWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyBadgeTypeArgs {
  @TypeGraphQL.Field(_type => BadgeTypeUpdateManyMutationInput, {
    nullable: false
  })
  data!: BadgeTypeUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => BadgeTypeWhereInput, {
    nullable: true
  })
  where?: BadgeTypeWhereInput | undefined;
}
