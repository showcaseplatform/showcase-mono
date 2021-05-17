import { ClassType } from "type-graphql";
import * as crudResolvers from "./resolvers/crud/resolvers-crud.index";
import * as actionResolvers from "./resolvers/crud/resolvers-actions.index";
import * as relationResolvers from "./resolvers/relations/resolvers.index";
import * as models from "./models";
import * as outputTypes from "./resolvers/outputs";
import * as inputTypes from "./resolvers/inputs";
import * as argsTypes from "./resolvers/crud/args.index";

const crudResolversMap = {
  Profile: crudResolvers.ProfileCrudResolver,
  User: crudResolvers.UserCrudResolver,
  BadgeType: crudResolvers.BadgeTypeCrudResolver
};
const relationResolversMap = {
  Profile: relationResolvers.ProfileRelationsResolver,
  User: relationResolvers.UserRelationsResolver,
  BadgeType: relationResolvers.BadgeTypeRelationsResolver
};
const actionResolversMap = {
  Profile: {
    profile: actionResolvers.FindUniqueProfileResolver,
    findFirstProfile: actionResolvers.FindFirstProfileResolver,
    profiles: actionResolvers.FindManyProfileResolver,
    createProfile: actionResolvers.CreateProfileResolver,
    createManyProfile: actionResolvers.CreateManyProfileResolver,
    deleteProfile: actionResolvers.DeleteProfileResolver,
    updateProfile: actionResolvers.UpdateProfileResolver,
    deleteManyProfile: actionResolvers.DeleteManyProfileResolver,
    updateManyProfile: actionResolvers.UpdateManyProfileResolver,
    upsertProfile: actionResolvers.UpsertProfileResolver,
    aggregateProfile: actionResolvers.AggregateProfileResolver,
    groupByProfile: actionResolvers.GroupByProfileResolver
  },
  User: {
    user: actionResolvers.FindUniqueUserResolver,
    findFirstUser: actionResolvers.FindFirstUserResolver,
    users: actionResolvers.FindManyUserResolver,
    createUser: actionResolvers.CreateUserResolver,
    createManyUser: actionResolvers.CreateManyUserResolver,
    deleteUser: actionResolvers.DeleteUserResolver,
    updateUser: actionResolvers.UpdateUserResolver,
    deleteManyUser: actionResolvers.DeleteManyUserResolver,
    updateManyUser: actionResolvers.UpdateManyUserResolver,
    upsertUser: actionResolvers.UpsertUserResolver,
    aggregateUser: actionResolvers.AggregateUserResolver,
    groupByUser: actionResolvers.GroupByUserResolver
  },
  BadgeType: {
    badgeType: actionResolvers.FindUniqueBadgeTypeResolver,
    findFirstBadgeType: actionResolvers.FindFirstBadgeTypeResolver,
    badgeTypes: actionResolvers.FindManyBadgeTypeResolver,
    createBadgeType: actionResolvers.CreateBadgeTypeResolver,
    createManyBadgeType: actionResolvers.CreateManyBadgeTypeResolver,
    deleteBadgeType: actionResolvers.DeleteBadgeTypeResolver,
    updateBadgeType: actionResolvers.UpdateBadgeTypeResolver,
    deleteManyBadgeType: actionResolvers.DeleteManyBadgeTypeResolver,
    updateManyBadgeType: actionResolvers.UpdateManyBadgeTypeResolver,
    upsertBadgeType: actionResolvers.UpsertBadgeTypeResolver,
    aggregateBadgeType: actionResolvers.AggregateBadgeTypeResolver,
    groupByBadgeType: actionResolvers.GroupByBadgeTypeResolver
  }
};
const resolversInfo = {
  Profile: ["profile", "findFirstProfile", "profiles", "createProfile", "createManyProfile", "deleteProfile", "updateProfile", "deleteManyProfile", "updateManyProfile", "upsertProfile", "aggregateProfile", "groupByProfile"],
  User: ["user", "findFirstUser", "users", "createUser", "createManyUser", "deleteUser", "updateUser", "deleteManyUser", "updateManyUser", "upsertUser", "aggregateUser", "groupByUser"],
  BadgeType: ["badgeType", "findFirstBadgeType", "badgeTypes", "createBadgeType", "createManyBadgeType", "deleteBadgeType", "updateBadgeType", "deleteManyBadgeType", "updateManyBadgeType", "upsertBadgeType", "aggregateBadgeType", "groupByBadgeType"]
};
const relationResolversInfo = {
  Profile: ["user", "badgeTypesCreated", "badgeTypesOwned"],
  User: ["profile"],
  BadgeType: ["creator", "owner"]
};
const modelsInfo = {
  Profile: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "userId", "createdAt", "updatedAt"],
  User: ["id", "email", "phone"],
  BadgeType: ["id", "creatorProfileId", "ownerProfileId", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply"]
};
const inputsInfo = {
  ProfileWhereInput: ["AND", "OR", "NOT", "id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "user", "userId", "createdAt", "updatedAt", "badgeTypesCreated", "badgeTypesOwned"],
  ProfileOrderByInput: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "userId", "createdAt", "updatedAt"],
  ProfileWhereUniqueInput: ["id", "userId"],
  ProfileScalarWhereWithAggregatesInput: ["AND", "OR", "NOT", "id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "userId", "createdAt", "updatedAt"],
  UserWhereInput: ["AND", "OR", "NOT", "id", "email", "phone", "profile"],
  UserOrderByInput: ["id", "email", "phone"],
  UserWhereUniqueInput: ["id", "email"],
  UserScalarWhereWithAggregatesInput: ["AND", "OR", "NOT", "id", "email", "phone"],
  BadgeTypeWhereInput: ["AND", "OR", "NOT", "id", "creator", "creatorProfileId", "owner", "ownerProfileId", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply"],
  BadgeTypeOrderByInput: ["id", "creatorProfileId", "ownerProfileId", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply"],
  BadgeTypeWhereUniqueInput: ["id", "tokenTypeBlockhainId"],
  BadgeTypeScalarWhereWithAggregatesInput: ["AND", "OR", "NOT", "id", "creatorProfileId", "ownerProfileId", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply"],
  ProfileCreateInput: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "createdAt", "updatedAt", "user", "badgeTypesCreated", "badgeTypesOwned"],
  ProfileUpdateInput: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "createdAt", "updatedAt", "user", "badgeTypesCreated", "badgeTypesOwned"],
  ProfileCreateManyInput: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "userId", "createdAt", "updatedAt"],
  ProfileUpdateManyMutationInput: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "createdAt", "updatedAt"],
  UserCreateInput: ["id", "email", "phone", "profile"],
  UserUpdateInput: ["id", "email", "phone", "profile"],
  UserCreateManyInput: ["id", "email", "phone"],
  UserUpdateManyMutationInput: ["id", "email", "phone"],
  BadgeTypeCreateInput: ["id", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply", "creator", "owner"],
  BadgeTypeUpdateInput: ["id", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply", "creator", "owner"],
  BadgeTypeCreateManyInput: ["id", "creatorProfileId", "ownerProfileId", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply"],
  BadgeTypeUpdateManyMutationInput: ["id", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply"],
  StringFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not"],
  StringNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not"],
  BoolFilter: ["equals", "not"],
  EnumCurrencyFilter: ["equals", "in", "notIn", "not"],
  DateTimeFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  UserRelationFilter: ["is", "isNot"],
  BadgeTypeRelationFilter: ["is", "isNot"],
  StringWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not", "count", "min", "max"],
  StringNullableWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not", "count", "min", "max"],
  BoolWithAggregatesFilter: ["equals", "not", "count", "min", "max"],
  EnumCurrencyWithAggregatesFilter: ["equals", "in", "notIn", "not", "count", "min", "max"],
  DateTimeWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "count", "min", "max"],
  ProfileRelationFilter: ["is", "isNot"],
  IntFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  EnumCategoryFilter: ["equals", "in", "notIn", "not"],
  IntWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "count", "avg", "sum", "min", "max"],
  EnumCategoryWithAggregatesFilter: ["equals", "in", "notIn", "not", "count", "min", "max"],
  UserCreateNestedOneWithoutProfileInput: ["create", "connectOrCreate", "connect"],
  BadgeTypeCreateNestedOneWithoutCreatorInput: ["create", "connectOrCreate", "connect"],
  BadgeTypeCreateNestedOneWithoutOwnerInput: ["create", "connectOrCreate", "connect"],
  StringFieldUpdateOperationsInput: ["set"],
  NullableStringFieldUpdateOperationsInput: ["set"],
  BoolFieldUpdateOperationsInput: ["set"],
  EnumCurrencyFieldUpdateOperationsInput: ["set"],
  DateTimeFieldUpdateOperationsInput: ["set"],
  UserUpdateOneRequiredWithoutProfileInput: ["create", "connectOrCreate", "upsert", "connect", "update"],
  BadgeTypeUpdateOneWithoutCreatorInput: ["create", "connectOrCreate", "upsert", "connect", "disconnect", "delete", "update"],
  BadgeTypeUpdateOneWithoutOwnerInput: ["create", "connectOrCreate", "upsert", "connect", "disconnect", "delete", "update"],
  ProfileCreateNestedOneWithoutUserInput: ["create", "connectOrCreate", "connect"],
  ProfileUpdateOneWithoutUserInput: ["create", "connectOrCreate", "upsert", "connect", "disconnect", "delete", "update"],
  ProfileCreateNestedOneWithoutBadgeTypesCreatedInput: ["create", "connectOrCreate", "connect"],
  ProfileCreateNestedOneWithoutBadgeTypesOwnedInput: ["create", "connectOrCreate", "connect"],
  IntFieldUpdateOperationsInput: ["set", "increment", "decrement", "multiply", "divide"],
  EnumCategoryFieldUpdateOperationsInput: ["set"],
  ProfileUpdateOneRequiredWithoutBadgeTypesCreatedInput: ["create", "connectOrCreate", "upsert", "connect", "update"],
  ProfileUpdateOneRequiredWithoutBadgeTypesOwnedInput: ["create", "connectOrCreate", "upsert", "connect", "update"],
  NestedStringFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not"],
  NestedStringNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not"],
  NestedBoolFilter: ["equals", "not"],
  NestedEnumCurrencyFilter: ["equals", "in", "notIn", "not"],
  NestedDateTimeFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  NestedStringWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not", "count", "min", "max"],
  NestedIntFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  NestedStringNullableWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not", "count", "min", "max"],
  NestedIntNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  NestedBoolWithAggregatesFilter: ["equals", "not", "count", "min", "max"],
  NestedEnumCurrencyWithAggregatesFilter: ["equals", "in", "notIn", "not", "count", "min", "max"],
  NestedDateTimeWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "count", "min", "max"],
  NestedEnumCategoryFilter: ["equals", "in", "notIn", "not"],
  NestedIntWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "count", "avg", "sum", "min", "max"],
  NestedFloatFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  NestedEnumCategoryWithAggregatesFilter: ["equals", "in", "notIn", "not", "count", "min", "max"],
  UserCreateWithoutProfileInput: ["id", "email", "phone"],
  UserCreateOrConnectWithoutProfileInput: ["where", "create"],
  BadgeTypeCreateWithoutCreatorInput: ["id", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply", "owner"],
  BadgeTypeCreateOrConnectWithoutCreatorInput: ["where", "create"],
  BadgeTypeCreateWithoutOwnerInput: ["id", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply", "creator"],
  BadgeTypeCreateOrConnectWithoutOwnerInput: ["where", "create"],
  UserUpsertWithoutProfileInput: ["update", "create"],
  UserUpdateWithoutProfileInput: ["id", "email", "phone"],
  BadgeTypeUpsertWithoutCreatorInput: ["update", "create"],
  BadgeTypeUpdateWithoutCreatorInput: ["id", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply", "owner"],
  BadgeTypeUpsertWithoutOwnerInput: ["update", "create"],
  BadgeTypeUpdateWithoutOwnerInput: ["id", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply", "creator"],
  ProfileCreateWithoutUserInput: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "createdAt", "updatedAt", "badgeTypesCreated", "badgeTypesOwned"],
  ProfileCreateOrConnectWithoutUserInput: ["where", "create"],
  ProfileUpsertWithoutUserInput: ["update", "create"],
  ProfileUpdateWithoutUserInput: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "createdAt", "updatedAt", "badgeTypesCreated", "badgeTypesOwned"],
  ProfileCreateWithoutBadgeTypesCreatedInput: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "createdAt", "updatedAt", "user", "badgeTypesOwned"],
  ProfileCreateOrConnectWithoutBadgeTypesCreatedInput: ["where", "create"],
  ProfileCreateWithoutBadgeTypesOwnedInput: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "createdAt", "updatedAt", "user", "badgeTypesCreated"],
  ProfileCreateOrConnectWithoutBadgeTypesOwnedInput: ["where", "create"],
  ProfileUpsertWithoutBadgeTypesCreatedInput: ["update", "create"],
  ProfileUpdateWithoutBadgeTypesCreatedInput: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "createdAt", "updatedAt", "user", "badgeTypesOwned"],
  ProfileUpsertWithoutBadgeTypesOwnedInput: ["update", "create"],
  ProfileUpdateWithoutBadgeTypesOwnedInput: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "createdAt", "updatedAt", "user", "badgeTypesCreated"]
};
const outputsInfo = {
  AggregateProfile: ["count", "min", "max"],
  ProfileGroupBy: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "userId", "createdAt", "updatedAt", "count", "min", "max"],
  AggregateUser: ["count", "min", "max"],
  UserGroupBy: ["id", "email", "phone", "count", "min", "max"],
  AggregateBadgeType: ["count", "avg", "sum", "min", "max"],
  BadgeTypeGroupBy: ["id", "creatorProfileId", "ownerProfileId", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply", "count", "avg", "sum", "min", "max"],
  AffectedRowsOutput: ["count"],
  ProfileCountAggregate: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "userId", "createdAt", "updatedAt", "_all"],
  ProfileMinAggregate: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "userId", "createdAt", "updatedAt"],
  ProfileMaxAggregate: ["id", "displayName", "username", "bio", "isCreator", "currency", "birthDate", "userId", "createdAt", "updatedAt"],
  UserCountAggregate: ["id", "email", "phone", "_all"],
  UserMinAggregate: ["id", "email", "phone"],
  UserMaxAggregate: ["id", "email", "phone"],
  BadgeTypeCountAggregate: ["id", "creatorProfileId", "ownerProfileId", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply", "_all"],
  BadgeTypeAvgAggregate: ["price", "shares", "supply"],
  BadgeTypeSumAggregate: ["price", "shares", "supply"],
  BadgeTypeMinAggregate: ["id", "creatorProfileId", "ownerProfileId", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply"],
  BadgeTypeMaxAggregate: ["id", "creatorProfileId", "ownerProfileId", "tokenTypeBlockhainId", "price", "title", "description", "category", "removedFromShowcase", "shares", "supply"]
};
const argsInfo = {
  FindUniqueProfileArgs: ["where"],
  FindFirstProfileArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  FindManyProfileArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  CreateProfileArgs: ["data"],
  CreateManyProfileArgs: ["data", "skipDuplicates"],
  DeleteProfileArgs: ["where"],
  UpdateProfileArgs: ["data", "where"],
  DeleteManyProfileArgs: ["where"],
  UpdateManyProfileArgs: ["data", "where"],
  UpsertProfileArgs: ["where", "create", "update"],
  AggregateProfileArgs: ["where", "orderBy", "cursor", "take", "skip"],
  GroupByProfileArgs: ["where", "orderBy", "by", "having", "take", "skip"],
  FindUniqueUserArgs: ["where"],
  FindFirstUserArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  FindManyUserArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  CreateUserArgs: ["data"],
  CreateManyUserArgs: ["data", "skipDuplicates"],
  DeleteUserArgs: ["where"],
  UpdateUserArgs: ["data", "where"],
  DeleteManyUserArgs: ["where"],
  UpdateManyUserArgs: ["data", "where"],
  UpsertUserArgs: ["where", "create", "update"],
  AggregateUserArgs: ["where", "orderBy", "cursor", "take", "skip"],
  GroupByUserArgs: ["where", "orderBy", "by", "having", "take", "skip"],
  FindUniqueBadgeTypeArgs: ["where"],
  FindFirstBadgeTypeArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  FindManyBadgeTypeArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  CreateBadgeTypeArgs: ["data"],
  CreateManyBadgeTypeArgs: ["data", "skipDuplicates"],
  DeleteBadgeTypeArgs: ["where"],
  UpdateBadgeTypeArgs: ["data", "where"],
  DeleteManyBadgeTypeArgs: ["where"],
  UpdateManyBadgeTypeArgs: ["data", "where"],
  UpsertBadgeTypeArgs: ["where", "create", "update"],
  AggregateBadgeTypeArgs: ["where", "orderBy", "cursor", "take", "skip"],
  GroupByBadgeTypeArgs: ["where", "orderBy", "by", "having", "take", "skip"]
};

type ResolverModelNames = keyof typeof crudResolversMap;

type ModelResolverActionNames<
  TModel extends ResolverModelNames
  > = keyof typeof crudResolversMap[TModel]["prototype"];

export type ResolverActionsConfig<
  TModel extends ResolverModelNames
  > = Partial<Record<ModelResolverActionNames<TModel> | "_all", MethodDecorator[]>>;

export type ResolversEnhanceMap = {
  [TModel in ResolverModelNames]?: ResolverActionsConfig<TModel>;
};

export function applyResolversEnhanceMap(
  resolversEnhanceMap: ResolversEnhanceMap,
) {
  for (const resolversEnhanceMapKey of Object.keys(resolversEnhanceMap)) {
    const modelName = resolversEnhanceMapKey as keyof typeof resolversEnhanceMap;
    const crudTarget = crudResolversMap[modelName].prototype;
    const resolverActionsConfig = resolversEnhanceMap[modelName]!;
    const actionResolversConfig = actionResolversMap[modelName];
    if (resolverActionsConfig._all) {
      const allActionsDecorators = resolverActionsConfig._all;
      const resolverActionNames = resolversInfo[modelName as keyof typeof resolversInfo];
      for (const resolverActionName of resolverActionNames) {
        const actionTarget = (actionResolversConfig[
          resolverActionName as keyof typeof actionResolversConfig
        ] as Function).prototype;
        for (const allActionsDecorator of allActionsDecorators) {
          allActionsDecorator(
            crudTarget,
            resolverActionName,
            Object.getOwnPropertyDescriptor(crudTarget, resolverActionName)!,
          );
          allActionsDecorator(
            actionTarget,
            resolverActionName,
            Object.getOwnPropertyDescriptor(actionTarget, resolverActionName)!,
          );
        }
      }
    }
    const resolverActionsToApply = Object.keys(resolverActionsConfig).filter(
      it => it !== "_all"
    );
    for (const resolverActionName of resolverActionsToApply) {
      const decorators = resolverActionsConfig[
        resolverActionName as keyof typeof resolverActionsConfig
      ] as MethodDecorator[];
      const actionTarget = (actionResolversConfig[
        resolverActionName as keyof typeof actionResolversConfig
      ] as Function).prototype;
      for (const decorator of decorators) {
        decorator(
          crudTarget,
          resolverActionName,
          Object.getOwnPropertyDescriptor(crudTarget, resolverActionName)!,
        );
        decorator(
          actionTarget,
          resolverActionName,
          Object.getOwnPropertyDescriptor(actionTarget, resolverActionName)!,
        );
      }
    }
  }
}

type RelationResolverModelNames = keyof typeof relationResolversMap;

type RelationResolverActionNames<
  TModel extends RelationResolverModelNames
  > = keyof typeof relationResolversMap[TModel]["prototype"];

export type RelationResolverActionsConfig<TModel extends RelationResolverModelNames>
  = Partial<Record<RelationResolverActionNames<TModel> | "_all", MethodDecorator[]>>;

export type RelationResolversEnhanceMap = {
  [TModel in RelationResolverModelNames]?: RelationResolverActionsConfig<TModel>;
};

export function applyRelationResolversEnhanceMap(
  relationResolversEnhanceMap: RelationResolversEnhanceMap,
) {
  for (const relationResolversEnhanceMapKey of Object.keys(relationResolversEnhanceMap)) {
    const modelName = relationResolversEnhanceMapKey as keyof typeof relationResolversEnhanceMap;
    const relationResolverTarget = relationResolversMap[modelName].prototype;
    const relationResolverActionsConfig = relationResolversEnhanceMap[modelName]!;
    if (relationResolverActionsConfig._all) {
      const allActionsDecorators = relationResolverActionsConfig._all;
      const relationResolverActionNames = relationResolversInfo[modelName as keyof typeof relationResolversInfo];
      for (const relationResolverActionName of relationResolverActionNames) {
        for (const allActionsDecorator of allActionsDecorators) {
          allActionsDecorator(
            relationResolverTarget,
            relationResolverActionName,
            Object.getOwnPropertyDescriptor(relationResolverTarget, relationResolverActionName)!,
          );
        }
      }
    }
    const relationResolverActionsToApply = Object.keys(relationResolverActionsConfig).filter(
      it => it !== "_all"
    );
    for (const relationResolverActionName of relationResolverActionsToApply) {
      const decorators = relationResolverActionsConfig[
        relationResolverActionName as keyof typeof relationResolverActionsConfig
      ] as MethodDecorator[];
      for (const decorator of decorators) {
        decorator(
          relationResolverTarget,
          relationResolverActionName,
          Object.getOwnPropertyDescriptor(relationResolverTarget, relationResolverActionName)!,
        );
      }
    }
  }
}

type TypeConfig = {
  class?: ClassDecorator[];
  fields?: FieldsConfig;
};

type FieldsConfig<TTypeKeys extends string = string> = Partial<
  Record<TTypeKeys | "_all", PropertyDecorator[]>
>;

function applyTypeClassEnhanceConfig<
  TEnhanceConfig extends TypeConfig,
  TType extends object
>(
  enhanceConfig: TEnhanceConfig,
  typeClass: ClassType<TType>,
  typePrototype: TType,
  typeFieldNames: string[]
) {
  if (enhanceConfig.class) {
    for (const decorator of enhanceConfig.class) {
      decorator(typeClass);
    }
  }
  if (enhanceConfig.fields) {
    if (enhanceConfig.fields._all) {
      const allFieldsDecorators = enhanceConfig.fields._all;
      for (const typeFieldName of typeFieldNames) {
        for (const allFieldsDecorator of allFieldsDecorators) {
          allFieldsDecorator(typePrototype, typeFieldName);
        }
      }
    }
    const configFieldsToApply = Object.keys(enhanceConfig.fields).filter(
      it => it !== "_all"
    );
    for (const typeFieldName of configFieldsToApply) {
      const fieldDecorators = enhanceConfig.fields[typeFieldName]!;
      for (const fieldDecorator of fieldDecorators) {
        fieldDecorator(typePrototype, typeFieldName);
      }
    }
  }
}

type ModelNames = keyof typeof models;

type ModelFieldNames<TModel extends ModelNames> = Exclude<
  keyof typeof models[TModel]["prototype"],
  number | symbol
>;

type ModelFieldsConfig<TModel extends ModelNames> = FieldsConfig<
  ModelFieldNames<TModel>
>;

export type ModelConfig<TModel extends ModelNames> = {
  class?: ClassDecorator[];
  fields?: ModelFieldsConfig<TModel>;
};

export type ModelsEnhanceMap = {
  [TModel in ModelNames]?: ModelConfig<TModel>;
};

export function applyModelsEnhanceMap(modelsEnhanceMap: ModelsEnhanceMap) {
  for (const modelsEnhanceMapKey of Object.keys(modelsEnhanceMap)) {
    const modelName = modelsEnhanceMapKey as keyof typeof modelsEnhanceMap;
    const modelConfig = modelsEnhanceMap[modelName]!;
    const modelClass = models[modelName];
    const modelTarget = modelClass.prototype;
    applyTypeClassEnhanceConfig(
      modelConfig,
      modelClass,
      modelTarget,
      modelsInfo[modelName as keyof typeof modelsInfo],
    );
  }
}

type OutputTypesNames = keyof typeof outputTypes;

type OutputTypeFieldNames<TOutput extends OutputTypesNames> = Exclude<
  keyof typeof outputTypes[TOutput]["prototype"],
  number | symbol
>;

type OutputTypeFieldsConfig<
  TOutput extends OutputTypesNames
  > = FieldsConfig<OutputTypeFieldNames<TOutput>>;

export type OutputTypeConfig<TOutput extends OutputTypesNames> = {
  class?: ClassDecorator[];
  fields?: OutputTypeFieldsConfig<TOutput>;
};

export type OutputTypesEnhanceMap = {
  [TOutput in OutputTypesNames]?: OutputTypeConfig<TOutput>;
};

export function applyOutputTypesEnhanceMap(
  outputTypesEnhanceMap: OutputTypesEnhanceMap,
) {
  for (const outputTypeEnhanceMapKey of Object.keys(outputTypesEnhanceMap)) {
    const outputTypeName = outputTypeEnhanceMapKey as keyof typeof outputTypesEnhanceMap;
    const typeConfig = outputTypesEnhanceMap[outputTypeName]!;
    const typeClass = outputTypes[outputTypeName];
    const typeTarget = typeClass.prototype;
    applyTypeClassEnhanceConfig(
      typeConfig,
      typeClass,
      typeTarget,
      outputsInfo[outputTypeName as keyof typeof outputsInfo],
    );
  }
}

type InputTypesNames = keyof typeof inputTypes;

type InputTypeFieldNames<TInput extends InputTypesNames> = Exclude<
  keyof typeof inputTypes[TInput]["prototype"],
  number | symbol
>;

type InputTypeFieldsConfig<
  TInput extends InputTypesNames
  > = FieldsConfig<InputTypeFieldNames<TInput>>;

export type InputTypeConfig<TInput extends InputTypesNames> = {
  class?: ClassDecorator[];
  fields?: InputTypeFieldsConfig<TInput>;
};

export type InputTypesEnhanceMap = {
  [TInput in InputTypesNames]?: InputTypeConfig<TInput>;
};

export function applyInputTypesEnhanceMap(
  inputTypesEnhanceMap: InputTypesEnhanceMap,
) {
  for (const inputTypeEnhanceMapKey of Object.keys(inputTypesEnhanceMap)) {
    const inputTypeName = inputTypeEnhanceMapKey as keyof typeof inputTypesEnhanceMap;
    const typeConfig = inputTypesEnhanceMap[inputTypeName]!;
    const typeClass = inputTypes[inputTypeName];
    const typeTarget = typeClass.prototype;
    applyTypeClassEnhanceConfig(
      typeConfig,
      typeClass,
      typeTarget,
      inputsInfo[inputTypeName as keyof typeof inputsInfo],
    );
  }
}

type ArgsTypesNames = keyof typeof argsTypes;

type ArgFieldNames<TArgsType extends ArgsTypesNames> = Exclude<
  keyof typeof argsTypes[TArgsType]["prototype"],
  number | symbol
>;

type ArgFieldsConfig<
  TArgsType extends ArgsTypesNames
  > = FieldsConfig<ArgFieldNames<TArgsType>>;

export type ArgConfig<TArgsType extends ArgsTypesNames> = {
  class?: ClassDecorator[];
  fields?: ArgFieldsConfig<TArgsType>;
};

export type ArgsTypesEnhanceMap = {
  [TArgsType in ArgsTypesNames]?: ArgConfig<TArgsType>;
};

export function applyArgsTypesEnhanceMap(
  argsTypesEnhanceMap: ArgsTypesEnhanceMap,
) {
  for (const argsTypesEnhanceMapKey of Object.keys(argsTypesEnhanceMap)) {
    const argsTypeName = argsTypesEnhanceMapKey as keyof typeof argsTypesEnhanceMap;
    const typeConfig = argsTypesEnhanceMap[argsTypeName]!;
    const typeClass = argsTypes[argsTypeName];
    const typeTarget = typeClass.prototype;
    applyTypeClassEnhanceConfig(
      typeConfig,
      typeClass,
      typeTarget,
      argsInfo[argsTypeName as keyof typeof argsInfo],
    );
  }
}







