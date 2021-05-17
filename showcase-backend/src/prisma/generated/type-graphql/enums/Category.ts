import * as TypeGraphQL from "type-graphql";

export enum Category {
  Art = "Art",
  Music = "Music",
  Photo = "Photo",
  Misc = "Misc",
  Podcast = "Podcast",
  Animals = "Animals",
  Style = "Style"
}
TypeGraphQL.registerEnumType(Category, {
  name: "Category",
  description: undefined,
});
