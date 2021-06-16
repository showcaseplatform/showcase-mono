import { createParamDecorator } from 'type-graphql'
import { MyContext } from '../../services/apollo'

export const CurrentUser = () => {
  return createParamDecorator<MyContext>(({ context }) => {
    return context.user
  })
}
