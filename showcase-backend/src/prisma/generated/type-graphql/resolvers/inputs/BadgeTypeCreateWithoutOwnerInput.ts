import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ProfileCreateNestedOneWithoutBadgeTypesCreatedInput } from "../inputs/ProfileCreateNestedOneWithoutBadgeTypesCreatedInput";
import { Category } from "../../enums/Category";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class BadgeTypeCreateWithoutOwnerInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  id?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  tokenTypeBlockhainId!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  price!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  title!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  description!: string;

  @TypeGraphQL.Field(_type => Category, {
    nullable: true
  })
  category?: "Art" | "Music" | "Photo" | "Misc" | "Podcast" | "Animals" | "Style" | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  removedFromShowcase?: boolean | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  shares!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  supply!: number;

  @TypeGraphQL.Field(_type => ProfileCreateNestedOneWithoutBadgeTypesCreatedInput, {
    nullable: false
  })
  creator!: ProfileCreateNestedOneWithoutBadgeTypesCreatedInput;
}
