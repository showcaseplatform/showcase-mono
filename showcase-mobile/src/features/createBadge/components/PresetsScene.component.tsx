import React from 'react'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { Spacer } from '../../../components/Spacer.component'
import { IonIconName } from '../../../utils/helpers'
import { FilterSelector } from './FilterSelector.component'

type PresetSceneProps = {
  onChange: (presetName: string) => void // arg: IFiltersProps
}

// todo: fix react-native-gl-image-filters name-types
type PresetSettingProps = {
  label: string
  iconName: IonIconName
  name: string // Preset name
}

// todo: replace built-in presets with customs as business required
const presetSettings: PresetSettingProps[] = [
  {
    name: 'AmaroPreset',
    label: 'Amaro',
    iconName: 'arrow-back-circle',
  },
  {
    name: 'ClarendonPreset',
    label: 'Clarendon',
    iconName: 'arrow-back-circle',
  },
  {
    name: 'DogpatchPreset',
    label: 'Dogpatch',
    iconName: 'arrow-back-circle',
  },
  {
    name: 'GinghamPreset',
    label: 'Gingham',
    iconName: 'arrow-back-circle',
  },
  { name: 'GinzaPreset', label: 'Ginza', iconName: 'arrow-back-circle' },
  { name: 'HefePreset', label: 'Hefe', iconName: 'arrow-back-circle' },
  {
    name: 'LudwigPreset',
    label: 'Ludwig',
    iconName: 'arrow-back-circle',
  },
  { name: 'NoPreset', label: 'No', iconName: 'arrow-back-circle' },
  {
    name: 'SierraPreset',
    label: 'Sierra',
    iconName: 'arrow-back-circle',
  },
  {
    name: 'SkylinePreset',
    label: 'Skyline',
    iconName: 'arrow-back-circle',
  },
  {
    name: 'SlumberPreset',
    label: 'Slumber',
    iconName: 'arrow-back-circle',
  },
  {
    name: 'StinsonPreset',
    label: 'Stinson',
    iconName: 'arrow-back-circle',
  },
]

const defaultPresetState = 'NoPreset'
const tempImage = require('../../../../assets/favicon.png')

export const PresetsScene = ({ onChange }: PresetSceneProps) => {
  const [activePreset, setActivePreset] = useState<string>(defaultPresetState)

  const handleTogglePreset = (presetName: string) => {
    if (activePreset !== presetName) {
      setActivePreset(presetName)
      onChange(presetName)
    } else {
      setActivePreset(defaultPresetState)
      onChange(activePreset)
    }
  }

  return (
    <ScrollView
      horizontal
      centerContent
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ marginBottom: 'auto' }}
    >
      {presetSettings.map((p, i) => (
        <Spacer position="x" size="medium" key={`${p.name}-${i}`}>
          <FilterSelector
            active={p.name === activePreset}
            imageSrc={tempImage}
            label={p.label}
            setActive={() => handleTogglePreset(p.name)}
          />
        </Spacer>
      ))}
    </ScrollView>
  )
}
