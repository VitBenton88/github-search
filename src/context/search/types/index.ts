export interface SearchResultType {
  description: string
  id: number
  name: string
  owner: string
}

export type SearchRepositoriesHandler = (searchKeyword: string, filterPopular: boolean) => Promise<void>

export type SearchContextType = {
  filterPopular: boolean
  handleSearch: SearchRepositoriesHandler
  hasSearched: boolean
  isLoading: boolean
  repositories: SearchResultType[]
  searchTerm: string
}