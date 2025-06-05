import type { BasicRepositoryType } from '@/pages/Repository/types'

export type SearchRepositoriesHandler = (searchKeyword: string, filterPopular: boolean) => Promise<void>

export type SearchContextType = {
  filterPopular: boolean
  handleSearch: SearchRepositoriesHandler
  hasSearched: boolean
  isLoading: boolean
  repositories: BasicRepositoryType[]
  searchTerm: string
}