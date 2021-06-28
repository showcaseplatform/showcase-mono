import { useMemo, useState, Dispatch, SetStateAction } from 'react'

import Fuse from 'fuse.js'
import useDebounce from 'react-use/lib/useDebounce'

const useFuse = <T>(
  data: ReadonlyArray<T>,
  fuseOptions: Fuse.IFuseOptions<T> = {},
  debounce = 500
): [ReadonlyArray<T>, string, Dispatch<SetStateAction<string>>] => {
  const [filteredData, setFilteredData] = useState(data)
  const [query, setQuery] = useState('')
  const fuseSearch = useMemo(() => new Fuse(data, fuseOptions), [
    data,
    fuseOptions,
  ])
  useDebounce(
    () =>
      setFilteredData(
        query ? fuseSearch.search(query).map((i) => i.item) : data
      ),
    debounce,
    [query, data, debounce]
  )

  return [filteredData, query, setQuery]
}

export default useFuse
