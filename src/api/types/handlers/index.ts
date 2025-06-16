import type { BasicRepositoryType, RepositoryType } from '@/pages/Repository/types'

export type GetRepoHandler = (owner: string, name: string) => Promise<RepositoryType>
export type SearchReposHandler = (searchKeyword: string, filterPopular: boolean) => Promise<BasicRepositoryType[]>