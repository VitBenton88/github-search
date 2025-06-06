import { createContext } from 'react'
import type { SearchContextType } from '../types'

const defaultValue: SearchContextType = {
  filterPopular: false,
  handleSearch: async () => { },
  hasSearched: false,
  isLoading: false,
  repositories: [],
  searchTerm: '',
}

export const SearchContext = createContext<SearchContextType>(defaultValue)