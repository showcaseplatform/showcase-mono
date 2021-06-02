import { ObjectType, Field, createUnionType } from 'type-graphql';
import { Notification } from '@generated/type-graphql'

@ObjectType()
export class MarkerInfo {
  @Field()
  info: string;
}

export const MarkAsReaInfoUnion = createUnionType({
  name: "MarkAsReaInfoUnion",
  types: () => [Notification, MarkerInfo] as const,
  resolveType: value => {
    if ("id" in value) {
      return Notification; 
    }
    return MarkerInfo;
  },
});


