import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Category } from "../../enums/Category";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class BadgeTypeMaxAggregate {
  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  id!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  creatorProfileId!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  ownerProfileId!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  tokenTypeBlockhainId!: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  price!: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  title!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  description!: string | null;

  @TypeGraphQL.Field(_type => Category, {
    nullable: true
  })
  category!: "Art" | "Music" | "Photo" | "Misc" | "Podcast" | "Animals" | "Style" | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  removedFromShowcase!: boolean | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  shares!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  supply!: number | null;
}
