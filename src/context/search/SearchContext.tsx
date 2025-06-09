import { createContext } from 'react'
import type { SearchContextType } from '@/context/types'
import { defaultSearchContext } from '@/context/search/search.constants'

export const SearchContext = createContext<SearchContextType>(defaultSearchContext)