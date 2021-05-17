import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ProfileCreateWithoutBadgeTypesCreatedInput } from "../inputs/ProfileCreateWithoutBadgeTypesCreatedInput";
import { ProfileUpdateWithoutBadgeTypesCreatedInput } from "../inputs/ProfileUpdateWithoutBadgeTypesCreatedInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ProfileUpsertWithoutBadgeTypesCreatedInput {
  @TypeGraphQL.Field(_type => ProfileUpdateWithoutBadgeTypesCreatedInput, {
    nullable: false
  })
  update!: ProfileUpdateWithoutBadgeTypesCreatedInput;

  @TypeGraphQL.Field(_type => ProfileCreateWithoutBadgeTypesCreatedInput, {
    nullable: false
  })
  create!: ProfileCreateWithoutBadgeTypesCreatedInput;
}
