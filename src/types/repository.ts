export interface BasicRepositoryType {
  created_at: string
  id: string
  name: string
  owner: string
}

export interface RepositoryType extends BasicRepositoryType {
  allow_forking: boolean
  archived: boolean
  description: string
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