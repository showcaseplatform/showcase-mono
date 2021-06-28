import React from 'react'
import { View, Image, ImageProps } from 'react-native'
import styled from 'styled-components/native'
import LoadingIndicator from '../../../components/LoadingIndicator.component'
import { getImageSource } from '../../../utils/helpers'

interface BadgrePreviewProps extends Omit<ImageProps, 'source'> {
  loading?: boolean
  source?: string
}

const StyledImage = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`

const BadgePreviewImage = (props: BadgrePreviewProps) => {
  const { source, loading = false, ...rest } = props //onClick
  if (loading)
    return (
      <View style={{ height: 100, width: 100, justifyContent: 'center' }}>
        <LoadingIndicator size={30} />
      </View>
    )

  return (
    <StyledImage resizeMode="cover" source={getImageSource(source)} {...rest} />
  )
}

export default BadgePreviewImage
