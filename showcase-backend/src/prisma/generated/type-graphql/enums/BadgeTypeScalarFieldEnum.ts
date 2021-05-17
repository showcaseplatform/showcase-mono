import * as TypeGraphQL from "type-graphql";

export enum BadgeTypeScalarFieldEnum {
  id = "id",
  creatorProfileId = "creatorProfileId",
  ownerProfileId = "ownerProfileId",
  tokenTypeBlockhainId = "tokenTypeBlockhainId",
  price = "price",
  title = "title",
  description = "description",
  category = "category",
  removedFromShowcase = "removedFromShowcase",
  shares = "shares",
  supply = "supply"
}
TypeGraphQL.registerEnumType(BadgeTypeScalarFieldEnum, {
  name: "BadgeTypeScalarFieldEnum",
  description: undefined,
});
