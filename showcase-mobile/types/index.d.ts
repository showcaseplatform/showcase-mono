declare module 'camelize'
import { Profile } from '../src/generated/graphql'
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
