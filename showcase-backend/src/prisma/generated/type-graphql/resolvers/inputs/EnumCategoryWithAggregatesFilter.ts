import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumCategoryFilter } from "../inputs/NestedEnumCategoryFilter";
import { NestedEnumCategoryWithAggregatesFilter } from "../inputs/NestedEnumCategoryWithAggregatesFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { Category } from "../../enums/Category";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class EnumCategoryWithAggregatesFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumCategoryWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumCategoryWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumCategoryFilter, {
    nullable: true
  })
  min?: NestedEnumCategoryFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumCategoryFilter, {
    nullable: true
  })
  max?: NestedEnumCategoryFilter | undefined;
}
