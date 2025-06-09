import type { BasicRepositoryType, fetchRepositoryHandler, RepositoryType } from '@/pages/Repository/types'

export type NotificationType = 'success' | 'error' | 'info'

export type Notification = {
  message: string
  type: NotificationType
}

export type NotificationContextType = {
  notification: Notification | null
  notify: (message: string, type: NotificationType) => void
}

export type RepositoryContextType = {
  handleFetch: fetchRepositoryHandler
  isLoading: boolean
  repository: RepositoryType
}

export type SearchRepositoriesHandler = (searchKeyword: string, filterPopular: boolean) => Promise<void>

export type SearchContextType = {
  filterPopular: boolean
  handleSearch: SearchRepositoriesHandler
  hasSearched: boolean
  isLoading: boolean
  repositories: BasicRepositoryType[]
  searchTerm: string
}