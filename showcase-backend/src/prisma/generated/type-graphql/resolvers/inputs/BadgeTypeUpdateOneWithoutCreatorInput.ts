import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BadgeTypeCreateOrConnectWithoutCreatorInput } from "../inputs/BadgeTypeCreateOrConnectWithoutCreatorInput";
import { BadgeTypeCreateWithoutCreatorInput } from "../inputs/BadgeTypeCreateWithoutCreatorInput";
import { BadgeTypeUpdateWithoutCreatorInput } from "../inputs/BadgeTypeUpdateWithoutCreatorInput";
import { BadgeTypeUpsertWithoutCreatorInput } from "../inputs/BadgeTypeUpsertWithoutCreatorInput";
import { BadgeTypeWhereUniqueInput } from "../inputs/BadgeTypeWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class BadgeTypeUpdateOneWithoutCreatorInput {
  @TypeGraphQL.Field(_type => BadgeTypeCreateWithoutCreatorInput, {
    nullable: true
  })
  create?: BadgeTypeCreateWithoutCreatorInput | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeCreateOrConnectWithoutCreatorInput, {
    nullable: true
  })
  connectOrCreate?: BadgeTypeCreateOrConnectWithoutCreatorInput | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeUpsertWithoutCreatorInput, {
    nullable: true
  })
  upsert?: BadgeTypeUpsertWithoutCreatorInput | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeWhereUniqueInput, {
    nullable: true
  })
  connect?: BadgeTypeWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeUpdateWithoutCreatorInput, {
    nullable: true
  })
  update?: BadgeTypeUpdateWithoutCreatorInput | undefined;
}
