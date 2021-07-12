import { InputType, Field } from 'type-graphql'
import { Currency } from '@generated/type-graphql'
import { MaxLength, IsEmail } from 'class-validator'
import {
  PROFILE_MAX_BIO_LENGTH,
  PROFILE_MAX_USERNAME_LENGTH,
  PROFILE_MAX_DISPLAY_NAME_LENGTH,
} from '../../../consts/businessRules'

@InputType({ description: 'Data for updating profile info with custom validation' })
export class UpdateProfileInput {
  @Field({ nullable: true })
  @MaxLength(PROFILE_MAX_BIO_LENGTH, { message: 'Bio is too long' })
  bio?: string

  @Field({ nullable: true })
  @MaxLength(PROFILE_MAX_USERNAME_LENGTH, { message: 'Username is too long' })
  username?: string

  @Field({ nullable: true })
  @MaxLength(PROFILE_MAX_DISPLAY_NAME_LENGTH, { message: 'Display name is too long' })
  displayName?: string

  @Field({ nullable: true })
  @IsEmail({}, { message: 'Invalid email' })
  email?: string

  // todo: settle with one brithDate format
  @Field({ nullable: true })
  birthDate?: Date

  @Field(() => Currency, { nullable: true })
  currency?: Currency
}
