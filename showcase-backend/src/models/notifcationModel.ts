import { Arg, Ctx, Field, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import { getAllNotifications } from '../libs/notification/getAllNotifications'
import { getNotification } from '../libs/notification/getNotification'
import { markAsRead } from '../libs/notification/markNotifcations'
import { Uid } from '../types/user'

@ObjectType({ description: "The notifcation model" })
export class Notification {
  @Field(() => ID)
  id: string
  @Field()
  name: string
  // name: NotificationName
  @Field()
  uid: Uid
  @Field({nullable: true})
  title?: string
  @Field()
  body?: string
  // @Field()
  // data?: PushNotifcationData
  @Field()
  read?: boolean
  @Field()
  type?: string
  // type?: NotificationType
  @Field()
  createdAt?: Date
}


// single instance per app
@Resolver()
export class NotificationResolver {

  constructor() {}

  @Query(() => [Notification])
  async notifications(@Ctx() ctx: any): Promise<Notification[]> {
    // todo: where to add unreadCount?
    return await getAllNotifications(ctx.user.uid)
  }

  @Query(() => Notification)
  async notification(@Arg("id") id: string, @Ctx() ctx: any): Promise<Notification> {
    return await getNotification({uid: ctx.user.ui, notificationId: id})
  }

  @Mutation(() => Boolean)
  async markNotification(@Arg("id") id: string, @Ctx() ctx: any): Promise<boolean> {
    await markAsRead({uid: ctx.user.uid, notificationId: id})
    return true
  }
  
  
}

//  FOR COMPLEX QUERY ARGUMENTS WITH VALIDATION
// @ArgsType()
// class GetRecipesArgs {
//   @Field(type => Int, { defaultValue: 0 })
//   @Min(0)
//   skip: number;

//   @Field(type => Int)
//   @Min(1)
//   @Max(50)
//   take = 25;

//   @Field({ nullable: true })
//   title?: string;

//   // helpers - index calculations
//   get startIndex(): number {
//     return this.skip;
//   }
//   get endIndex(): number {
//     return this.skip + this.take;
//   }
// }
// ...
//  @Query(returns => [Recipe])
//  async recipes(@Args() { title, startIndex, endIndex }: GetRecipesArgs) {
//    // sample implementation
//    let recipes = this.recipesCollection;
//    if (title) {
//      recipes = recipes.filter(recipe => recipe.title === title);
//    }
//    return recipes.slice(startIndex, endIndex);
//  }

// FOR MUTATIONS ARGUMENTS:
// @InputType()
// class MarkNotificationInput implements Partial<Notification> {
//   @Field()
//   id: string;
// }