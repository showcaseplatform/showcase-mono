import { ApolloError } from '@apollo/client/errors'
import React from 'react'
import { View, Text } from 'react-native'

// todo: build me properly, make Error prop required
const Error = ({ error }: { error?: ApolloError }) => {
  return (
    <View>
      <Text>something went wrong</Text>
      <Text>{JSON.stringify(error)}</Text>
    </View>
  )
}

export default Error
