import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ProfileCreateOrConnectWithoutBadgeTypesOwnedInput } from "../inputs/ProfileCreateOrConnectWithoutBadgeTypesOwnedInput";
import { ProfileCreateWithoutBadgeTypesOwnedInput } from "../inputs/ProfileCreateWithoutBadgeTypesOwnedInput";
import { ProfileWhereUniqueInput } from "../inputs/ProfileWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ProfileCreateNestedOneWithoutBadgeTypesOwnedInput {
  @TypeGraphQL.Field(_type => ProfileCreateWithoutBadgeTypesOwnedInput, {
    nullable: true
  })
  create?: ProfileCreateWithoutBadgeTypesOwnedInput | undefined;

  @TypeGraphQL.Field(_type => ProfileCreateOrConnectWithoutBadgeTypesOwnedInput, {
    nullable: true
  })
  connectOrCreate?: ProfileCreateOrConnectWithoutBadgeTypesOwnedInput | undefined;

  @TypeGraphQL.Field(_type => ProfileWhereUniqueInput, {
    nullable: true
  })
  connect?: ProfileWhereUniqueInput | undefined;
}
