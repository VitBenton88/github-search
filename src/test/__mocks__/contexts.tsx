import { mockMultipleSearchResults, mockRepository } from '@mocks/repositories'
import { vi } from 'vitest'
import type { RepositoryContextType } from '@/context/repository/types'
import type { SearchContextType } from '@/context/search/types'

export const mockSearchContext: SearchContextType = {
  filterPopular: false,
  handleSearch: vi.fn(),
  hasSearched: false,
  isLoading: false,
  searchTerm: '',
  repositories: mockMultipleSearchResults
}

export const mockRepositoryContext: RepositoryContextType = {
  handleFetch: vi.fn(),
  isLoading: false,
  repository: mockRepository
}