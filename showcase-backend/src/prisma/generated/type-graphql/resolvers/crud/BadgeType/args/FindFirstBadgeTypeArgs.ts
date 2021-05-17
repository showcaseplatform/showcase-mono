import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { BadgeTypeOrderByInput } from "../../../inputs/BadgeTypeOrderByInput";
import { BadgeTypeWhereInput } from "../../../inputs/BadgeTypeWhereInput";
import { BadgeTypeWhereUniqueInput } from "../../../inputs/BadgeTypeWhereUniqueInput";
import { BadgeTypeScalarFieldEnum } from "../../../../enums/BadgeTypeScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindFirstBadgeTypeArgs {
  @TypeGraphQL.Field(_type => BadgeTypeWhereInput, {
    nullable: true
  })
  where?: BadgeTypeWhereInput | undefined;

  @TypeGraphQL.Field(_type => [BadgeTypeOrderByInput], {
    nullable: true
  })
  orderBy?: BadgeTypeOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => BadgeTypeWhereUniqueInput, {
    nullable: true
  })
  cursor?: BadgeTypeWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [BadgeTypeScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "creatorProfileId" | "ownerProfileId" | "tokenTypeBlockhainId" | "price" | "title" | "description" | "category" | "removedFromShowcase" | "shares" | "supply"> | undefined;
}
