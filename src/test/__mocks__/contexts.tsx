import { vi } from 'vitest'
import { mockBasicRepos, mockRepo } from '@mocks/repositories'
import type { RepositoryContextType } from '@/pages/Repository/types'
import type { SearchContextType } from '@/pages/Search/types'

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