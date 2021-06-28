import AsyncStorage from '@react-native-async-storage/async-storage'

export type Store<T> = {
  get(): Promise<T>
  set(input: T): Promise<void>
  remove(): Promise<void>
}

// todo: remove console logs asap
export default function createStore<T>(
  key: string,
  encoder?: (input: T) => string,
  decoder?: (input: string) => T
): Store<T> {
  function encode(input: T) {
    if (encoder) return encoder(input)
    if (typeof input === 'string') {
      return input
    } else {
      return JSON.stringify(input)
    }
  }

  function decode(input: string) {
    if (decoder) return decoder(input)
    try {
      return JSON.parse(input)
    } catch {
      return input
    }
  }

  async function get() {
    const result = await AsyncStorage.getItem(key)
      .then((r) => {
        // console.log(r)
        return r
      })
      .catch((r) => {
        return r
      })
    if (result === null) return result
    return decode(result)
  }

  function set(data: T) {
    if (!data) throw Error(`No data supplied for storage '${key}'`)
    return AsyncStorage.setItem(key, encode(data))
      .then((r) => {
        return r
      })
      .catch((r) => {
        return r
      })
  }

  function remove() {
    return AsyncStorage.removeItem(key)
      .then((r) => {
        return r
      })
      .catch((r) => {
        return r
      })
  }

  return { get, set, remove }
}
