import { Context, useContext } from 'react'

export default function useSafeContext<T>(context: Context<T | undefined>): T {
  const c = useContext(context)

  if (c === undefined)
    throw Error(`(${context.displayName}): useSafeContext within providers`)

  return c
}
