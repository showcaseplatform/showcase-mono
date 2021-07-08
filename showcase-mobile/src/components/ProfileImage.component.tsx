import React from 'react'
import { View, Image, Pressable, ImageProps } from 'react-native'
import styled from 'styled-components/native'
import LoadingIndicator from './LoadingIndicator.component'
import { getImageSource } from '../utils/helpers'
import { Maybe } from '../generated/graphql'

interface ProfileImageProps extends Omit<ImageProps, 'source'> {
  loading?: boolean
  source: Maybe<string | undefined>
  small?: boolean
  onClick?: () => void
}

const StyledProfileImage = styled(Image)<{ small?: boolean }>`
  width: ${({ small }) => (small ? '50px' : '100px')};
  height: ${({ small }) => (small ? '50px' : '100px')};
  border-radius: 50px;
`

const ProfileImage = (props: ProfileImageProps) => {
  const { source, small = false, loading = false, onClick, ...rest } = props

  if (loading)
    return (
      <View
        style={{
          height: small ? 50 : 100,
          width: small ? 50 : 100,
          justifyContent: 'center',
        }}
      >
        <LoadingIndicator size={30} />
      </View>
    )

  return (
    <Pressable onPress={onClick}>
      <StyledProfileImage
        resizeMode="cover"
        source={getImageSource(source as string | undefined)}
        small={small}
        {...rest}
      />
    </Pressable>
  )
}

export default ProfileImage
