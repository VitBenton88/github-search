import type { SearchContextType } from '@/context/search/types'

export const defaultSearchContext: SearchContextType = {
  filterPopular: false,
  handleSearch: async () => { },
  hasSearched: false,
  isLoading: false,
  repositories: [],
  searchTerm: '',
}