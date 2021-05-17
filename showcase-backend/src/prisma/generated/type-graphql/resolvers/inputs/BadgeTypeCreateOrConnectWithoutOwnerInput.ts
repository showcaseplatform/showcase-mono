import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BadgeTypeCreateWithoutOwnerInput } from "../inputs/BadgeTypeCreateWithoutOwnerInput";
import { BadgeTypeWhereUniqueInput } from "../inputs/BadgeTypeWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class BadgeTypeCreateOrConnectWithoutOwnerInput {
  @TypeGraphQL.Field(_type => BadgeTypeWhereUniqueInput, {
    nullable: false
  })
  where!: BadgeTypeWhereUniqueInput;

  @TypeGraphQL.Field(_type => BadgeTypeCreateWithoutOwnerInput, {
    nullable: false
  })
  create!: BadgeTypeCreateWithoutOwnerInput;
}
