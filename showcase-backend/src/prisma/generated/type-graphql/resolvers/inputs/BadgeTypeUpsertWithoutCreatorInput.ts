import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BadgeTypeCreateWithoutCreatorInput } from "../inputs/BadgeTypeCreateWithoutCreatorInput";
import { BadgeTypeUpdateWithoutCreatorInput } from "../inputs/BadgeTypeUpdateWithoutCreatorInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class BadgeTypeUpsertWithoutCreatorInput {
  @TypeGraphQL.Field(_type => BadgeTypeUpdateWithoutCreatorInput, {
    nullable: false
  })
  update!: BadgeTypeUpdateWithoutCreatorInput;

  @TypeGraphQL.Field(_type => BadgeTypeCreateWithoutCreatorInput, {
    nullable: false
  })
  create!: BadgeTypeCreateWithoutCreatorInput;
}
