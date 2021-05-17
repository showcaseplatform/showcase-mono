import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { BadgeTypeOrderByInput } from "../../../inputs/BadgeTypeOrderByInput";
import { BadgeTypeWhereInput } from "../../../inputs/BadgeTypeWhereInput";
import { BadgeTypeWhereUniqueInput } from "../../../inputs/BadgeTypeWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateBadgeTypeArgs {
  @TypeGraphQL.Field(_type => BadgeTypeWhereInput, {
    nullable: true
  })
  where?: BadgeTypeWhereInput | undefined;

  @TypeGraphQL.Field(_type => [BadgeTypeOrderByInput], {
    nullable: true
  })
  orderBy?: BadgeTypeOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeWhereUniqueInput, {
    nullable: true
  })
  cursor?: BadgeTypeWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
