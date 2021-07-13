import { Ionicons } from '@expo/vector-icons'
import * as React from 'react'
import { View, TextInput, Text, TextInputProps } from 'react-native'
import { FieldError } from 'react-hook-form'
import styled from 'styled-components'

interface MyTextFieldProps extends TextInputProps {
  error?: FieldError
  icon?: boolean // replace with an Icon component if it's required
  hasErrorField?: boolean
  inputRef?: React.MutableRefObject<TextInput | null>
}

export const InputWrapper = styled(View)`
  width: 100%;
  margin-vertical: ${({ theme }) => theme.space[1]};
`
export const StyledTextInput = styled(TextInput)<{ error?: FieldError }>`
  flex-grow: 1;
  border-bottom-width: 1px;
  border-radius: 5px;
  padding-vertical: 5px;
  padding-left: 5px;
  font-size: 16px;
  min-height: ${(props) =>
    props?.numberOfLines
      ? props.numberOfLines * 22
      : 40}px; /* fontsize + lineheight * number of lines || fix height */
  background-color: ${({ theme }) => theme.colors.ui.inputBgLight};
  color: ${({ theme }) => theme.colors.text.primary};
  border-bottom-color: ${({ error, theme }) =>
    error ? theme.colors.ui.error : 'transparent'};
`

export const ErrorText = styled(Text)`
  font-size: 14px;
  min-height: 21px; /* workaround to prevent layout jumping if there is no error (fontsize + line height) */
  color: ${({ theme }) => theme.colors.text.error};
  padding-top: ${({ theme }) => theme.space[1]};
`

const IconWrapper = styled(View)`
  position: absolute;
  right: ${({ theme }) => theme.space[2]};
`

export default function (props: MyTextFieldProps) {
  const {
    onBlur,
    onChangeText,
    value,
    error,
    icon,
    hasErrorField = false,
    inputRef,
  } = props

  return (
    <InputWrapper>
      <View flexDirection="row" alignItems="center">
        <StyledTextInput
          onBlur={onBlur}
          onChangeText={onChangeText}
          value={value}
          ref={(r) => inputRef?.current !== undefined && (inputRef.current = r)}
          {...props}
        />
        {icon && (
          <IconWrapper>
            <Ionicons name="chevron-down-outline" size={24} color="#666" />
          </IconWrapper>
        )}
      </View>

      {hasErrorField && <ErrorText>{error && error.message}</ErrorText>}
    </InputWrapper>
  )
}
