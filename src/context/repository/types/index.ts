import type { RepositoryType } from '@/pages/Repository/types'

export type fetchRepositoryHandler = (owner: string, name: string) => Promise<void>

export type RepositoryContextType = {
  handleFetch: fetchRepositoryHandler
  isLoading: boolean
  repository: RepositoryType
}