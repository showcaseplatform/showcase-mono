import * as TypeGraphQL from "type-graphql";

export enum Currency {
  USD = "USD",
  EUR = "EUR"
}
TypeGraphQL.registerEnumType(Currency, {
  name: "Currency",
  description: undefined,
});
