export type SearchHandler = (searchKeyword: string, filterPopular: boolean) => Promise<void>

export interface SearchResultType {
  description: string
  id: number
  name: string
  owner: string
}

export type SearchContextType = {
  filterPopular: boolean
  handleSearch: SearchHandler
  hasSearched: boolean
  isLoading: boolean
  results: SearchResultType[]
  searchTerm: string
}