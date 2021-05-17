import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { BadgeTypeOrderByInput } from "../../../inputs/BadgeTypeOrderByInput";
import { BadgeTypeScalarWhereWithAggregatesInput } from "../../../inputs/BadgeTypeScalarWhereWithAggregatesInput";
import { BadgeTypeWhereInput } from "../../../inputs/BadgeTypeWhereInput";
import { BadgeTypeScalarFieldEnum } from "../../../../enums/BadgeTypeScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByBadgeTypeArgs {
  @TypeGraphQL.Field(_type => BadgeTypeWhereInput, {
    nullable: true
  })
  where?: BadgeTypeWhereInput | undefined;

  @TypeGraphQL.Field(_type => [BadgeTypeOrderByInput], {
    nullable: true
  })
  orderBy?: BadgeTypeOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [BadgeTypeScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "creatorProfileId" | "ownerProfileId" | "tokenTypeBlockhainId" | "price" | "title" | "description" | "category" | "removedFromShowcase" | "shares" | "supply">;

  @TypeGraphQL.Field(_type => BadgeTypeScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: BadgeTypeScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
