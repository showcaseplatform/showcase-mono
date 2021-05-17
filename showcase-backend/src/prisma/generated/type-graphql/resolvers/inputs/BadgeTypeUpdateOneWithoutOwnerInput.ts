import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BadgeTypeCreateOrConnectWithoutOwnerInput } from "../inputs/BadgeTypeCreateOrConnectWithoutOwnerInput";
import { BadgeTypeCreateWithoutOwnerInput } from "../inputs/BadgeTypeCreateWithoutOwnerInput";
import { BadgeTypeUpdateWithoutOwnerInput } from "../inputs/BadgeTypeUpdateWithoutOwnerInput";
import { BadgeTypeUpsertWithoutOwnerInput } from "../inputs/BadgeTypeUpsertWithoutOwnerInput";
import { BadgeTypeWhereUniqueInput } from "../inputs/BadgeTypeWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class BadgeTypeUpdateOneWithoutOwnerInput {
  @TypeGraphQL.Field(_type => BadgeTypeCreateWithoutOwnerInput, {
    nullable: true
  })
  create?: BadgeTypeCreateWithoutOwnerInput | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeCreateOrConnectWithoutOwnerInput, {
    nullable: true
  })
  connectOrCreate?: BadgeTypeCreateOrConnectWithoutOwnerInput | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeUpsertWithoutOwnerInput, {
    nullable: true
  })
  upsert?: BadgeTypeUpsertWithoutOwnerInput | undefined;

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

  @TypeGraphQL.Field(_type => BadgeTypeUpdateWithoutOwnerInput, {
    nullable: true
  })
  update?: BadgeTypeUpdateWithoutOwnerInput | undefined;
}
