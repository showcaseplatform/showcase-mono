import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ProfileCreateOrConnectWithoutBadgeTypesCreatedInput } from "../inputs/ProfileCreateOrConnectWithoutBadgeTypesCreatedInput";
import { ProfileCreateWithoutBadgeTypesCreatedInput } from "../inputs/ProfileCreateWithoutBadgeTypesCreatedInput";
import { ProfileWhereUniqueInput } from "../inputs/ProfileWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ProfileCreateNestedOneWithoutBadgeTypesCreatedInput {
  @TypeGraphQL.Field(_type => ProfileCreateWithoutBadgeTypesCreatedInput, {
    nullable: true
  })
  create?: ProfileCreateWithoutBadgeTypesCreatedInput | undefined;

  @TypeGraphQL.Field(_type => ProfileCreateOrConnectWithoutBadgeTypesCreatedInput, {
    nullable: true
  })
  connectOrCreate?: ProfileCreateOrConnectWithoutBadgeTypesCreatedInput | undefined;

  @TypeGraphQL.Field(_type => ProfileWhereUniqueInput, {
    nullable: true
  })
  connect?: ProfileWhereUniqueInput | undefined;
}
