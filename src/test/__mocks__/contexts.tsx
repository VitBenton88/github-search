import { mockBasicRepos, mockRepo } from '@mocks/repositories'
import { vi } from 'vitest'
import type { RepositoryContextType, SearchContextType } from '@/context/types'

export const mockSearchContext: SearchContextType = {
  filterPopular: false,
  handleSearch: vi.fn(),
  hasSearched: false,
  isLoading: false,
  searchTerm: '',
  repositories: mockBasicRepos
}

export const mockRepositoryContext: RepositoryContextType = {
  handleFetch: vi.fn(),
  isLoading: false,
  repository: mockRepo
}