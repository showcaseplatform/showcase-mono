import randomWords from 'random-words'

export const createRandomNames = (phone: string) => {
  const words = randomWords({ exactly: 2 })
  const displayName = words.map((w) => w[0].toUpperCase() + w.substr(1)).join(' ')
  const username = words.join('_') + '_' + phone.substr(phone.length - 2)
  return { displayName, username }
}

export const getRandomNum = () => {
  return Math.floor(Math.random() * 899999 + 100000)
}
