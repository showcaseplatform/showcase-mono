import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Slider from '@react-native-community/slider'
import { Ionicons } from '@expo/vector-icons'

import { Spacer } from '../../../components/Spacer.component'
import { IonIconName } from '../../../utils/helpers'
import styled, { useTheme } from 'styled-components/native'
import { FilterSelector } from './FilterSelector.component'

export type FilterStateProps = {
  hue: number
  blur: number
  sepia: number
  sharpen: number
  negative: number
  contrast: number
  saturation: number
  brightness: number
  temperature: number
  exposure: number
}

type FilterSetting = {
  name: keyof FilterStateProps
  iconName: IonIconName
  minValue: number
  maxValue: number
  step?: number
}

// todo: extract me
export const defaultFilterState = {
  hue: 0,
  blur: 0,
  sepia: 0,
  sharpen: 0,
  negative: 0,
  contrast: 1,
  saturation: 1,
  brightness: 1,
  temperature: 6500,
  exposure: 0,
}

const SliderWrapper = styled(View)`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  padding-left: 7, 5%;
  padding-right: 2, 5%;
  padding-vertical: 5%;
`

const ResetWrapper = styled(View)`
  width: 40px;
  align-items: center;
`

// todo: Extract me!
const filterSettings: FilterSetting[] = [
  {
    name: 'brightness',
    iconName: 'sunny',
    minValue: 0,
    maxValue: 5,
  },
  {
    name: 'saturation',
    iconName: 'color-fill-sharp',
    minValue: 0.0,
    maxValue: 2,
  },
  {
    name: 'hue',
    iconName: 'brush-sharp',
    minValue: 0,
    maxValue: 6.3,
  },
  {
    name: 'contrast',
    iconName: 'contrast',
    minValue: -10.0,
    maxValue: 10.0,
  },
  {
    name: 'blur',
    iconName: 'water-sharp',
    minValue: 0,
    maxValue: 30,
  },
  {
    name: 'sharpen',
    iconName: 'navigate-sharp',
    minValue: 0,
    maxValue: 15,
  },
  {
    name: 'negative',
    iconName: 'trending-down-sharp',
    minValue: -2.0,
    maxValue: 2.0,
  },
  {
    name: 'temperature',
    iconName: 'thermometer-sharp',
    minValue: 0.0,
    maxValue: 40000.0,
  },
  {
    name: 'exposure',
    iconName: 'eye-sharp',
    step: 0.05,
    minValue: -1.0,
    maxValue: 1.0,
  },
  // { // ? overlapping saturation, business decision req., greyscale does not available atm
  //   name: 'greyscale',
  //   iconName: 'swap-horizontal-sharp',
  //   minValue: -5,
  //   maxValue: 5,
  // },
]

export const FilterScene = ({
  filterState,
  onFilterChange,
  onResetFilters,
}: {
  filterState: FilterStateProps
  onFilterChange: (key: string, value: number) => void
  onResetFilters: (key: string) => void
}) => {
  const theme = useTheme()
  const [activeFilter, setActiveFilter] = useState<number>(0)
  const { name, minValue, maxValue } = filterSettings[activeFilter]

  return (
    <>
      <SliderWrapper>
        <Slider
          value={filterState[name]}
          minimumValue={minValue}
          maximumValue={maxValue}
          onSlidingComplete={(value) => onFilterChange(name, value)}
          minimumTrackTintColor={theme.colors.ui.accent}
          maximumTrackTintColor={theme.colors.ui.disabled}
          style={{ flex: 1 }}
        />
        <Spacer position="right" size="medium" />
        <ResetWrapper>
          {filterState[name] !== defaultFilterState[name] && (
            <TouchableOpacity onPress={() => onResetFilters(name)}>
              <Ionicons
                name="refresh-sharp"
                size={36}
                color={theme.colors.ui.accent}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            </TouchableOpacity>
          )}
        </ResetWrapper>
      </SliderWrapper>
      <ScrollView
        horizontal
        centerContent
        showsHorizontalScrollIndicator={false}
      >
        {filterSettings.map((_, i) => (
          <Spacer position="x" size="medium" key={i}>
            <FilterSelector
              active={i === activeFilter}
              iconName={filterSettings[i].iconName}
              label={filterSettings[i].name}
              setActive={() => setActiveFilter(i)}
            />
          </Spacer>
        ))}
      </ScrollView>
    </>
  )
}
