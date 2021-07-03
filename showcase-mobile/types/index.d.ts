declare module 'camelize'
import { Profile } from '../src/generated/graphql'
import { Ionicons } from '@expo/vector-icons'

interface TypedResponse<T = any> extends Response {
  json<P = T>(): Promise<P>
}

declare function fetch<T>(...args: any): Promise<TypedResponse<T>>

export type MyUser = {
  profile: Pick<
    Profile,
    | 'id'
    | 'username'
    | 'bio'
    | 'email'
    | 'currency'
    | 'birthDate'
    | 'displayName'
  >
}
export interface MyBadgeCategory {
  id: number
  label: Category
  iconName: React.ComponentProps<typeof Ionicons>['name']
  gradientColors: string[]
}
