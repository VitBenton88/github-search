import type { RepositoryType } from '@/context/repository/types'
import type { SearchResultType } from '@/context/search/types'

/**
 * The subset of GitHub's repository response that the app reads. Unauthenticated responses
 * include many more fields (and omit some, like `permissions`); add fields here as they're used.
 * @see https://docs.github.com/en/rest/repos/repos#get-a-repository
 */
export type RepositoryApiResponse = {
  allow_forking: boolean
  archived: boolean
  created_at: string
  description: string | null
  has_downloads: boolean
  homepage: string | null
  html_url: string
  id: number
  language: string | null
  name: string
  owner: {
    html_url: string
    login: string
  }
  private: boolean
  size: number
  stargazers_count: number
  updated_at: string
}

export type GetRepoHandler = (owner: string, name: string, signal?: AbortSignal) => Promise<RepositoryType>
export type SearchReposHandler = (searchKeyword: string, filterPopular: boolean, signal?: AbortSignal) => Promise<SearchResultType[]>
