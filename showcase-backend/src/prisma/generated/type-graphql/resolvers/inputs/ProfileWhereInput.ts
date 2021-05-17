import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BadgeTypeRelationFilter } from "../inputs/BadgeTypeRelationFilter";
import { BoolFilter } from "../inputs/BoolFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { EnumCurrencyFilter } from "../inputs/EnumCurrencyFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";
import { UserRelationFilter } from "../inputs/UserRelationFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ProfileWhereInput {
  @TypeGraphQL.Field(_type => [ProfileWhereInput], {
    nullable: true
  })
  AND?: ProfileWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [ProfileWhereInput], {
    nullable: true
  })
  OR?: ProfileWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [ProfileWhereInput], {
    nullable: true
  })
  NOT?: ProfileWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  id?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  displayName?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  username?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  bio?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  isCreator?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => EnumCurrencyFilter, {
    nullable: true
  })
  currency?: EnumCurrencyFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  birthDate?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => UserRelationFilter, {
    nullable: true
  })
  user?: UserRelationFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  userId?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  updatedAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeRelationFilter, {
    nullable: true
  })
  badgeTypesCreated?: BadgeTypeRelationFilter | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeRelationFilter, {
    nullable: true
  })
  badgeTypesOwned?: BadgeTypeRelationFilter | undefined;
}
