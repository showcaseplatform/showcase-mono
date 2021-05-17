import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Category } from "../../enums/Category";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NestedEnumCategoryFilter {
  @TypeGraphQL.Field(_type => Category, {
    nullable: true
  })
  equals?: "Art" | "Music" | "Photo" | "Misc" | "Podcast" | "Animals" | "Style" | undefined;

  @TypeGraphQL.Field(_type => [Category], {
    nullable: true
  })
  in?: Array<"Art" | "Music" | "Photo" | "Misc" | "Podcast" | "Animals" | "Style"> | undefined;

  @TypeGraphQL.Field(_type => [Category], {
    nullable: true
  })
  notIn?: Array<"Art" | "Music" | "Photo" | "Misc" | "Podcast" | "Animals" | "Style"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumCategoryFilter, {
    nullable: true
  })
  not?: NestedEnumCategoryFilter | undefined;
}
