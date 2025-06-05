export interface BasicRepositoryType {
  description: string
  id: string
  name: string
  owner: string
}

export interface RepositoryType extends BasicRepositoryType {
  allow_forking: boolean
  archived: boolean
  created_at: string
  has_downloads: boolean
  homepage: string
  html_url: string
  isPrivate: boolean
  language: string
  owner_url: string
  size: number
  stargazers_count: number
  updated_at: string
}

export type fetchRepositoryHandler = (owner: string, name: string) => Promise<void>

export type RepositoryContextType = {
  handleFetch: fetchRepositoryHandler,
  repository: RepositoryType
  isLoading: boolean
}