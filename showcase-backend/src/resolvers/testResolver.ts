import { Resolver, Ctx, Mutation, Arg, Field, ObjectType } from 'type-graphql'

import axios from 'axios'
import { Uid } from '../types/user'
import { auth } from '../services/firebase'

@ObjectType()
class CustomToken {
  @Field()
  idToken: string

  @Field()
  refreshToken: string

  @Field()
  expiresIn: string

  @Field()
  isNewUser: boolean
}

@Resolver()
export class TestResolver {
  @Mutation((_returns) => CustomToken)
  async testLoginWithUid(@Ctx() ctx: any, @Arg('uid') uid: Uid) {
    console.log({ uid }, { ctx })
    return await loginWithUid(uid)
  }
}

const API_KEY = 'AIzaSyCYBkt1m7Km3M7zQPzL_XlpSVPLG7uOVpo'

const loginWithUid = async (uid: Uid) => {
  try {
    const token = await auth().createCustomToken(uid)
    console.log({ token })
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${API_KEY}`
    
    const data = {
      token,
      returnSecureToken: true,
    }

    const options = {
      method: 'post',
      url,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    } as any

    const response = await axios(options)
    return response.data
  } catch (error) {
    console.error({ error })
    return error
  }
}
