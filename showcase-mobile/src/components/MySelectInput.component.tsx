import { Ionicons } from '@expo/vector-icons'
import * as React from 'react'
import { FieldError } from 'react-hook-form'
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select'
import { InputWrapper, ErrorText } from './MyTextField.component'

interface Props extends PickerSelectProps {
  placeholder: string // must be required https://github.com/lawnstarter/react-native-picker-select/issues/207
  numberSelect?: boolean
  error?: FieldError
  hasErrorField?: boolean
}

export default function ({
  items,
  value,
  placeholder,
  error,
  numberSelect,
  hasErrorField,
  onValueChange,
  onDonePress,
}: Props) {
  return (
    <InputWrapper>
      <RNPickerSelect
        items={items}
        value={
          numberSelect
            ? typeof value === 'number'
              ? value
              : parseInt(value, 10)
            : value
        }
        onValueChange={onValueChange}
        onDonePress={onDonePress}
        style={{
          inputIOS: {
            borderRadius: 5,
            paddingRight: 10,
            paddingLeft: 10,
            height: 40,
            backgroundColor: 'rgb(248, 248, 248)',
            fontSize: 16,
          },
          inputAndroid: {
            borderRadius: 5,
            paddingRight: 10,
            paddingLeft: 10,
            height: 40,
            backgroundColor: 'rgb(248, 248, 248)',
            color: '#000',
          },
          iconContainer: {
            display: 'flex',
            justifyContent: 'center',
            height: '100%',
            marginRight: 10,
          },
        }}
        Icon={() => (
          <Ionicons name="chevron-down-outline" size={24} color="#666" />
        )}
        placeholder={{
          label: placeholder,
          color: '#666',
        }}
      />
      {hasErrorField && <ErrorText>{error && error.message}</ErrorText>}
    </InputWrapper>
  )
}
