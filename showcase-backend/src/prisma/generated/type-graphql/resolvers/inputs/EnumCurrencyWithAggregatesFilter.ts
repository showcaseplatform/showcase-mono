import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumCurrencyFilter } from "../inputs/NestedEnumCurrencyFilter";
import { NestedEnumCurrencyWithAggregatesFilter } from "../inputs/NestedEnumCurrencyWithAggregatesFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { Currency } from "../../enums/Currency";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class EnumCurrencyWithAggregatesFilter {
  @TypeGraphQL.Field(_type => Currency, {
    nullable: true
  })
  equals?: "USD" | "EUR" | undefined;

  @TypeGraphQL.Field(_type => [Currency], {
    nullable: true
  })
  in?: Array<"USD" | "EUR"> | undefined;

  @TypeGraphQL.Field(_type => [Currency], {
    nullable: true
  })
  notIn?: Array<"USD" | "EUR"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumCurrencyWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumCurrencyWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumCurrencyFilter, {
    nullable: true
  })
  min?: NestedEnumCurrencyFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumCurrencyFilter, {
    nullable: true
  })
  max?: NestedEnumCurrencyFilter | undefined;
}
