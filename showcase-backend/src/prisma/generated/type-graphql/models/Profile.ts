import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { BadgeType } from "../models/BadgeType";
import { User } from "../models/User";
import { Currency } from "../enums/Currency";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Profile {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  id!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  displayName!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  username!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  bio?: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  isCreator!: boolean;

  @TypeGraphQL.Field(_type => Currency, {
    nullable: false
  })
  currency!: "USD" | "EUR";

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  birthDate!: Date;

  user?: User;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  userId!: string;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

  badgeTypesCreated?: BadgeType | null;

  badgeTypesOwned?: BadgeType | null;
}
