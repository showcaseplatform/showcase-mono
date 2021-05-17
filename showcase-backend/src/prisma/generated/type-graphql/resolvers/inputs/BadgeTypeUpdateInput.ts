import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFieldUpdateOperationsInput } from "../inputs/BoolFieldUpdateOperationsInput";
import { EnumCategoryFieldUpdateOperationsInput } from "../inputs/EnumCategoryFieldUpdateOperationsInput";
import { IntFieldUpdateOperationsInput } from "../inputs/IntFieldUpdateOperationsInput";
import { ProfileUpdateOneRequiredWithoutBadgeTypesCreatedInput } from "../inputs/ProfileUpdateOneRequiredWithoutBadgeTypesCreatedInput";
import { ProfileUpdateOneRequiredWithoutBadgeTypesOwnedInput } from "../inputs/ProfileUpdateOneRequiredWithoutBadgeTypesOwnedInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class BadgeTypeUpdateInput {
  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  id?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  tokenTypeBlockhainId?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  price?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  title?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  description?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => EnumCategoryFieldUpdateOperationsInput, {
    nullable: true
  })
  category?: EnumCategoryFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  removedFromShowcase?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  shares?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  supply?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => ProfileUpdateOneRequiredWithoutBadgeTypesCreatedInput, {
    nullable: true
  })
  creator?: ProfileUpdateOneRequiredWithoutBadgeTypesCreatedInput | undefined;

  @TypeGraphQL.Field(_type => ProfileUpdateOneRequiredWithoutBadgeTypesOwnedInput, {
    nullable: true
  })
  owner?: ProfileUpdateOneRequiredWithoutBadgeTypesOwnedInput | undefined;
}
