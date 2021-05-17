import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BadgeTypeCreateWithoutOwnerInput } from "../inputs/BadgeTypeCreateWithoutOwnerInput";
import { BadgeTypeUpdateWithoutOwnerInput } from "../inputs/BadgeTypeUpdateWithoutOwnerInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class BadgeTypeUpsertWithoutOwnerInput {
  @TypeGraphQL.Field(_type => BadgeTypeUpdateWithoutOwnerInput, {
    nullable: false
  })
  update!: BadgeTypeUpdateWithoutOwnerInput;

  @TypeGraphQL.Field(_type => BadgeTypeCreateWithoutOwnerInput, {
    nullable: false
  })
  create!: BadgeTypeCreateWithoutOwnerInput;
}
