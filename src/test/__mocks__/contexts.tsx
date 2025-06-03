import type { SearchContextType } from '@/context/SearchContext'
import { vi } from 'vitest'
import { mockBasicRepos } from '@mocks/repositories'

export const mockSearchContext: SearchContextType = {
  filterPopular: false,
  handleSearch: vi.fn(),
  hasSearched: false,
  isLoading: false,
  searchTerm: '',
  repositories: mockBasicRepos
}