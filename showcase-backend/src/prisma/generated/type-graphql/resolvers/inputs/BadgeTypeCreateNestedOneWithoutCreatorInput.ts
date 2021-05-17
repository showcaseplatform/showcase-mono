import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BadgeTypeCreateOrConnectWithoutCreatorInput } from "../inputs/BadgeTypeCreateOrConnectWithoutCreatorInput";
import { BadgeTypeCreateWithoutCreatorInput } from "../inputs/BadgeTypeCreateWithoutCreatorInput";
import { BadgeTypeWhereUniqueInput } from "../inputs/BadgeTypeWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class BadgeTypeCreateNestedOneWithoutCreatorInput {
  @TypeGraphQL.Field(_type => BadgeTypeCreateWithoutCreatorInput, {
    nullable: true
  })
  create?: BadgeTypeCreateWithoutCreatorInput | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeCreateOrConnectWithoutCreatorInput, {
    nullable: true
  })
  connectOrCreate?: BadgeTypeCreateOrConnectWithoutCreatorInput | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeWhereUniqueInput, {
    nullable: true
  })
  connect?: BadgeTypeWhereUniqueInput | undefined;
}
