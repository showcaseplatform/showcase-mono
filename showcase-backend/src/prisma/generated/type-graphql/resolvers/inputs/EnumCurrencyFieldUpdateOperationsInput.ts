import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Currency } from "../../enums/Currency";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class EnumCurrencyFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => Currency, {
    nullable: true
  })
  set?: "USD" | "EUR" | undefined;
}
