import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BadgeTypeCreateWithoutCreatorInput } from "../inputs/BadgeTypeCreateWithoutCreatorInput";
import { BadgeTypeWhereUniqueInput } from "../inputs/BadgeTypeWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class BadgeTypeCreateOrConnectWithoutCreatorInput {
  @TypeGraphQL.Field(_type => BadgeTypeWhereUniqueInput, {
    nullable: false
  })
  where!: BadgeTypeWhereUniqueInput;

  @TypeGraphQL.Field(_type => BadgeTypeCreateWithoutCreatorInput, {
    nullable: false
  })
  create!: BadgeTypeCreateWithoutCreatorInput;
}
