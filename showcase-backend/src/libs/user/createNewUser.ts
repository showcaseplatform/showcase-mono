import { v5 as uuidv5 } from 'uuid'
import { EUROPEAN_COUNTRY_CODES } from '../../consts/countryCodes'
import { auth } from '../../services/firebase'
import prisma from '../../services/prisma'
import randomWords from 'random-words'
import { Currency } from '@generated/type-graphql'

const UUID_NAMESPAOCE = 'b01abb38-c109-4b71-9136-a2aa73ddde27' // todo: maybe outsource to config

const createRandomNames = (phone: string) => {
  const words = randomWords({ exactly: 2 })
  const displayName = words.map((w) => w[0].toUpperCase() + w.substr(1)).join(' ')
  const username = words.join('_') + '_' + phone.substr(phone.length - 2)
  return { displayName, username }
}

export const createNewUser = async ({
  phone,
  areaCode,
}: {
  phone: string
  areaCode: string
}) => {
  const customUserId = uuidv5(phone, UUID_NAMESPAOCE)

  const { uid } = await auth().createUser({
    phoneNumber: phone,
    uid: customUserId,
  })

  let currency = Currency.USD //default USD

  if (areaCode === '44') {
    currency = Currency.GBP
  } else if (EUROPEAN_COUNTRY_CODES.indexOf(areaCode + '') > -1) {
    currency = Currency.EUR
  }

  const { displayName, username } = createRandomNames(phone)
  return await prisma.user.create({
    data: {
      phone,
      authId: uid,
      profile: {
        create: {
          displayName,
          username,
          currency
        },
      },
      balance: {}
    },
  })
}
