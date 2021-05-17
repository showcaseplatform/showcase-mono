import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BadgeTypeCreateNestedOneWithoutCreatorInput } from "../inputs/BadgeTypeCreateNestedOneWithoutCreatorInput";
import { BadgeTypeCreateNestedOneWithoutOwnerInput } from "../inputs/BadgeTypeCreateNestedOneWithoutOwnerInput";
import { Currency } from "../../enums/Currency";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ProfileCreateWithoutUserInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  id?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  displayName!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  username!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  bio?: string | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  isCreator!: boolean;

  @TypeGraphQL.Field(_type => Currency, {
    nullable: true
  })
  currency?: "USD" | "EUR" | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  birthDate!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeCreateNestedOneWithoutCreatorInput, {
    nullable: true
  })
  badgeTypesCreated?: BadgeTypeCreateNestedOneWithoutCreatorInput | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeCreateNestedOneWithoutOwnerInput, {
    nullable: true
  })
  badgeTypesOwned?: BadgeTypeCreateNestedOneWithoutOwnerInput | undefined;
}
