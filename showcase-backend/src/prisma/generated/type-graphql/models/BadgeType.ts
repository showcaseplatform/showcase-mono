import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Profile } from "../models/Profile";
import { Category } from "../enums/Category";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class BadgeType {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  id!: string;

  creator?: Profile;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  creatorProfileId!: string;

  owner?: Profile;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  ownerProfileId!: string;

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
    nullable: false
  })
  category!: "Art" | "Music" | "Photo" | "Misc" | "Podcast" | "Animals" | "Style";

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  removedFromShowcase!: boolean;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  shares!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  supply!: number;
}
