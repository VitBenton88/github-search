import type { RepositoryContextType } from '@/context/repository/types'
import type { RepositoryType } from '@/pages/Repository/types'

const defaultRepository: RepositoryType = {
  description: '',
  id: 0,
  name: '',
  owner: '',
  allow_forking: false,
  archived: false,
  created_at: '',
  has_downloads: false,
  homepage: '',
  html_url: '',
  isPrivate: false,
  language: '',
  owner_url: '',
  size: 0,
  stargazers_count: 0,
  updated_at: '',
}

export const defaultRepositoryContext: RepositoryContextType = {
  handleFetch: async () => { },
  isLoading: true,
  repository: defaultRepository,
}