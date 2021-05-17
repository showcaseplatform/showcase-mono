import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BadgeTypeAvgAggregate } from "../outputs/BadgeTypeAvgAggregate";
import { BadgeTypeCountAggregate } from "../outputs/BadgeTypeCountAggregate";
import { BadgeTypeMaxAggregate } from "../outputs/BadgeTypeMaxAggregate";
import { BadgeTypeMinAggregate } from "../outputs/BadgeTypeMinAggregate";
import { BadgeTypeSumAggregate } from "../outputs/BadgeTypeSumAggregate";
import { Category } from "../../enums/Category";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class BadgeTypeGroupBy {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  id!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  creatorProfileId!: string;

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

  @TypeGraphQL.Field(_type => BadgeTypeCountAggregate, {
    nullable: true
  })
  count!: BadgeTypeCountAggregate | null;

  @TypeGraphQL.Field(_type => BadgeTypeAvgAggregate, {
    nullable: true
  })
  avg!: BadgeTypeAvgAggregate | null;

  @TypeGraphQL.Field(_type => BadgeTypeSumAggregate, {
    nullable: true
  })
  sum!: BadgeTypeSumAggregate | null;

  @TypeGraphQL.Field(_type => BadgeTypeMinAggregate, {
    nullable: true
  })
  min!: BadgeTypeMinAggregate | null;

  @TypeGraphQL.Field(_type => BadgeTypeMaxAggregate, {
    nullable: true
  })
  max!: BadgeTypeMaxAggregate | null;
}
