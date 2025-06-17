export type SearchRepositoriesHandler = (searchKeyword: string, filterPopular: boolean) => Promise<void>

export interface SearchResultType {
  description: string
  id: number
  name: string
  owner: string
}

export type SearchContextType = {
  filterPopular: boolean
  handleSearch: SearchRepositoriesHandler
  hasSearched: boolean
  isLoading: boolean
  repositories: SearchResultType[]
  searchTerm: string
}