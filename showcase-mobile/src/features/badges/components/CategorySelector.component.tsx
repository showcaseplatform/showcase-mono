import React from 'react'
import { ScrollView } from 'react-native'

import { Category } from '../../../generated/graphql'
import { categories } from '../../../utils/helpers'

import { CategoryItem } from './CategoryItem.component'

const CategorySelector = ({
  activeCategory,
  onSelect,
}: {
  activeCategory?: Category
  onSelect: (label?: Category) => void
}) => {
  return (
    <ScrollView
      horizontal
      centerContent
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
    >
      {categories.map((c) => (
        <CategoryItem
          category={c}
          onPress={onSelect}
          isActive={c.label === activeCategory}
          key={c.id}
        />
      ))}
    </ScrollView>
  )
}

export default CategorySelector
