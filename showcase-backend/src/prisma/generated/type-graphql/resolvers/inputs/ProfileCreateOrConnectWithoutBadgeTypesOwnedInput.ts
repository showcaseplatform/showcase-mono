import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ProfileCreateWithoutBadgeTypesOwnedInput } from "../inputs/ProfileCreateWithoutBadgeTypesOwnedInput";
import { ProfileWhereUniqueInput } from "../inputs/ProfileWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ProfileCreateOrConnectWithoutBadgeTypesOwnedInput {
  @TypeGraphQL.Field(_type => ProfileWhereUniqueInput, {
    nullable: false
  })
  where!: ProfileWhereUniqueInput;

  @TypeGraphQL.Field(_type => ProfileCreateWithoutBadgeTypesOwnedInput, {
    nullable: false
  })
  create!: ProfileCreateWithoutBadgeTypesOwnedInput;
}
