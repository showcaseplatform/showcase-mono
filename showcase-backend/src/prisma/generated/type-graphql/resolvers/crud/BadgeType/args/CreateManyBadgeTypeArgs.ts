import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { BadgeTypeCreateManyInput } from "../../../inputs/BadgeTypeCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyBadgeTypeArgs {
  @TypeGraphQL.Field(_type => [BadgeTypeCreateManyInput], {
    nullable: false
  })
  data!: BadgeTypeCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
