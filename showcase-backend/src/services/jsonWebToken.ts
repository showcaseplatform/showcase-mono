import { GraphQLError } from 'graphql'
import { sign, SignOptions, verify } from 'jsonwebtoken'
import { jwt } from '../config'

enum JwtErrorMessages {
  PrivateKeyNotFound = 'Private key not found, please check your .env file',
}

interface JwtVerify {
  phone: string
  iat: number
  epx: number
}

class JwtClient {
  generateToken(phone: string, options?: SignOptions) {
    return sign({ phone }, this.getPrivateKey(), {
      expiresIn: '90 days', // todo: should expire sooner in prod
      ...options,
    })
  }

  verifyToken(token: string) {
    try {
      return verify(token, this.getPrivateKey()) as JwtVerify
    } catch (error) {
      console.error('Invalid jwt token', { error })
      throw new GraphQLError(error.message)
    }
  }

  getPrivateKey(): string {
    const privateKey = jwt.privateKey
    if (!privateKey) {
      throw new GraphQLError(JwtErrorMessages.PrivateKeyNotFound)
    }
    return privateKey
  }
}

export const jwtClient = new JwtClient()
