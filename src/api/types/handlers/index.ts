import type { RepositoryType } from '@/context/repository/types'
import type { SearchResultType } from '@/context/search/types'

export type GetRepoHandler = (owner: string, name: string, signal?: AbortSignal) => Promise<RepositoryType>
export type SearchReposHandler = (searchKeyword: string, filterPopular: boolean, signal?: AbortSignal) => Promise<SearchResultType[]>