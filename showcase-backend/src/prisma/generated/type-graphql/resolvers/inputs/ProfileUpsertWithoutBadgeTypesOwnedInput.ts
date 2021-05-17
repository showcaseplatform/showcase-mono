import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ProfileCreateWithoutBadgeTypesOwnedInput } from "../inputs/ProfileCreateWithoutBadgeTypesOwnedInput";
import { ProfileUpdateWithoutBadgeTypesOwnedInput } from "../inputs/ProfileUpdateWithoutBadgeTypesOwnedInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ProfileUpsertWithoutBadgeTypesOwnedInput {
  @TypeGraphQL.Field(_type => ProfileUpdateWithoutBadgeTypesOwnedInput, {
    nullable: false
  })
  update!: ProfileUpdateWithoutBadgeTypesOwnedInput;

  @TypeGraphQL.Field(_type => ProfileCreateWithoutBadgeTypesOwnedInput, {
    nullable: false
  })
  create!: ProfileCreateWithoutBadgeTypesOwnedInput;
}
