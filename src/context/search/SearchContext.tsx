import { createContext } from 'react'
import type { SearchContextType } from '@/context/search/types'
import { defaultSearchContext } from '@/context/search/search.constants'

const SearchContext = createContext<SearchContextType>(defaultSearchContext)

export default SearchContext