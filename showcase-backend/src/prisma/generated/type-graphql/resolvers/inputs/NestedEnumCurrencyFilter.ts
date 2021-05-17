import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Currency } from "../../enums/Currency";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NestedEnumCurrencyFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumCurrencyFilter, {
    nullable: true
  })
  not?: NestedEnumCurrencyFilter | undefined;
}
