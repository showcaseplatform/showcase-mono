import React, { useCallback, useState } from 'react'
import { FieldError } from 'react-hook-form'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import DateTimePickerModal, {
  ReactNativeModalDateTimePickerProps,
} from 'react-native-modal-datetime-picker'
import { format } from 'date-fns'

import MyTextInputComponent, {
  ErrorText,
  InputWrapper,
} from './MyTextField.component'

interface MyDatePickerInput
  extends Omit<ReactNativeModalDateTimePickerProps, 'onCancel'> {
  error?: FieldError
  value: Date
  placeholder?: string
  hasErrorField?: boolean
}

const MyDatePickerInput = (props: MyDatePickerInput) => {
  const { error, value, placeholder, onConfirm, hasErrorField, maximumDate } =
    props
  const [showModal, setShowModal] = useState<boolean>(false)
  const showDatePicker = useCallback(() => setShowModal(true), [])
  const hideDatePicker = useCallback(() => setShowModal(false), [])

  const handleConfirm = useCallback(
    (date: Date) => {
      onConfirm(date)
      hideDatePicker()
    },
    [hideDatePicker, onConfirm]
  )

  const handleCancel = useCallback(() => {
    hideDatePicker()
  }, [hideDatePicker])

  return (
    <InputWrapper>
      <TouchableWithoutFeedback onPress={showDatePicker}>
        <MyTextInputComponent
          value={value ? format(new Date(value), 'dd/MM/yyyy') : undefined}
          editable={false}
          error={error}
          placeholder={placeholder}
          icon
        />
        {hasErrorField && <ErrorText>{error && error.message}</ErrorText>}
      </TouchableWithoutFeedback>
      <DateTimePickerModal
        {...props}
        isVisible={showModal}
        date={new Date(value)}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        mode="date"
        maximumDate={maximumDate || new Date()}
        customCancelButtonIOS={() => null}
        headerTextIOS={placeholder ?? placeholder}
        isDarkModeEnabled={false}
      />
    </InputWrapper>
  )
}

export default MyDatePickerInput
