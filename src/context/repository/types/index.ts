import type { fetchRepositoryHandler, RepositoryType } from '@/pages/Repository/types'

export type RepositoryContextType = {
  handleFetch: fetchRepositoryHandler
  isLoading: boolean
  repository: RepositoryType
}