export type fetchRepositoryHandler = (owner: string, name: string) => Promise<void>

export type RepositoryType = {
  id: number
  description: string
  name: string
  owner: string
  allow_forking: boolean
  archived: boolean
  created_at: string
  has_downloads: boolean
  homepage: string | undefined
  html_url: string
  isPrivate: boolean
  language: string | undefined
  owner_url: string
  size: number
  stargazers_count: number
  updated_at: string
}

export type RepositoryContextType = {
  handleFetch: fetchRepositoryHandler
  isLoading: boolean
  repository: RepositoryType
}