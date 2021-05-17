import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BadgeTypeWhereInput } from "../inputs/BadgeTypeWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class BadgeTypeRelationFilter {
  @TypeGraphQL.Field(_type => BadgeTypeWhereInput, {
    nullable: true
  })
  is?: BadgeTypeWhereInput | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeWhereInput, {
    nullable: true
  })
  isNot?: BadgeTypeWhereInput | undefined;
}
