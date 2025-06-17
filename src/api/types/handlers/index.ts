import type { RepositoryType } from '@/context/repository/types'
import type { SearchResultType } from '@/context/search/types'

export type GetRepoHandler = (owner: string, name: string) => Promise<RepositoryType>
export type SearchReposHandler = (searchKeyword: string, filterPopular: boolean) => Promise<SearchResultType[]>