import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BadgeTypeAvgAggregate } from "../outputs/BadgeTypeAvgAggregate";
import { BadgeTypeCountAggregate } from "../outputs/BadgeTypeCountAggregate";
import { BadgeTypeMaxAggregate } from "../outputs/BadgeTypeMaxAggregate";
import { BadgeTypeMinAggregate } from "../outputs/BadgeTypeMinAggregate";
import { BadgeTypeSumAggregate } from "../outputs/BadgeTypeSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class AggregateBadgeType {
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
