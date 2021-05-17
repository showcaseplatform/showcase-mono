import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Category } from "../../enums/Category";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class EnumCategoryFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => Category, {
    nullable: true
  })
  set?: "Art" | "Music" | "Photo" | "Misc" | "Podcast" | "Animals" | "Style" | undefined;
}
