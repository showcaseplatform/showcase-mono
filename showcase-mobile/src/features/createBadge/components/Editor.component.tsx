import React, { useCallback, useState } from 'react'
import { Dimensions } from 'react-native'
import { TabView } from 'react-native-tab-view'
import ImageFilters, { Presets } from 'react-native-gl-image-filters' // !: Presets type / value is broken, do not remove
import { Surface } from 'gl-react-expo'
import GLImage from 'gl-react-image'
import { GLView } from 'expo-gl'

import { EditorTab, TabRouteProps } from './EditorTab.component'
import { PresetsScene } from './PresetsScene.component'
import {
  FilterStateProps,
  defaultFilterState,
  FilterScene,
} from './FilterScene.component'
import styled from 'styled-components/native'

type EditorProps = {
  imageUri: string
  setImageRef: (node: GLView) => void
}

const StyledSurface = styled(Surface)`
  width: 100%;
  height: 100%;
  flex: 2;
`

const width = Dimensions.get('window').width

const editorTabs: TabRouteProps[] = [
  { key: 'filters', icon: 'color-palette' },
  { key: 'presets', icon: 'color-filter' },
]

export const Editor: React.FC<EditorProps> = ({ imageUri, setImageRef }) => {
  const [tabIndex, setTabIndex] = React.useState(0)

  const [filterState, setFilterState] =
    useState<FilterStateProps>(defaultFilterState)
  const [presetState, setPresetState] = useState<FilterStateProps | undefined>(
    undefined
  )

  const handleFilterChange = (key: string, value: number) => {
    setFilterState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const handleResetFilter = useCallback((key: string) => {
    setFilterState((prevState) => ({
      ...prevState,
      [key]: defaultFilterState[key as keyof FilterStateProps], // defined locally to avoid circular dependency
    }))
  }, [])

  const handlePresetChange = (presetName: string) => {
    const preset = Presets[presetName]
    setPresetState(preset)
  }

  return (
    <>
      <StyledSurface ref={setImageRef}>
        <ImageFilters
          {...filterState}
          {...presetState}
          width={width}
          height={width}
        >
          <GLImage source={{ uri: imageUri }} resizeMode="contain" />
        </ImageFilters>
      </StyledSurface>

      <TabView
        initialLayout={{ width }}
        tabBarPosition="bottom"
        navigationState={{ index: tabIndex, routes: editorTabs }}
        renderTabBar={EditorTab}
        onIndexChange={setTabIndex}
        swipeEnabled={false}
        lazy
        renderScene={(props: { route: TabRouteProps }) =>
          props.route.key === 'filters' ? (
            <FilterScene
              filterState={filterState}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilter}
            />
          ) : (
            <PresetsScene onChange={handlePresetChange} />
          )
        }
      />
    </>
  )
}
