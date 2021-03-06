import { GraphQLError } from 'graphql'
import { sign, SignOptions, verify } from 'jsonwebtoken'
import { jwt } from '../config'

enum JwtErrorMessages {
  PrivateKeyNotFound = 'Private key not found, please check your .env file',
}

interface JwtVerify {
  id: string
  iat: number
  epx: number
}
class JwtClient {
  generateToken(id: string, options?: SignOptions) {
    return sign({ id }, this.getPrivateKey(), {
      expiresIn: jwt.expiresIn,
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
