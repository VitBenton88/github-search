import type { BasicRepositoryType, RepositoryType } from '@/pages/Repository/types'

type GetRepoHandler = (owner: string, name: string) => Promise<RepositoryType>
type SearchReposHandler = (searchKeyword: string, filterPopular: boolean) => Promise<BasicRepositoryType[]>

const BASE_URL = 'https://api.github.com'

/**
 * Search repositories.
 * @param searchKeyword - Keyword for search query.
 * @param popularFilter - Filter search query for popular repositories (>1k stars).
 */
export const searchRepositories: SearchReposHandler = async (searchKeyword = '', popularFilter = false) => {
  const url = new URL(`${BASE_URL}/search/repositories`)
  url.searchParams.set('q', searchKeyword)

  if (popularFilter) {
    url.searchParams.set('q', `${searchKeyword} stars:>1000`)
  }

  const fetchUrl = url.toString()
  const response = await fetch(fetchUrl)

  if (response.ok) {
    const { items } = await response.json()

    return items.map(
      (repo: {
        description: string
        id: string
        name: string
        owner: { login: string }
      }): BasicRepositoryType => ({
        description: repo.description,
        id: repo.id,
        name: repo.name,
        owner: repo.owner.login
      })
    )
  } else {
    console.error(response)
    throw new Error(`Failed to search repositories. ${response.status} ${response.statusText}`)
  }
}

/**
 * Get an individual repository's data.
 * @param owner - Name of repository's owner.
 * @param name - Repository's name.
 */
export const getRepository: GetRepoHandler = async (owner = '', name = '') => {
  const url = new URL(`${BASE_URL}/repos/${owner}/${name}`)

  const fetchUrl = url.toString()
  const response = await fetch(fetchUrl)

  if (response.ok) {
    const {
      allow_forking,
      archived,
      created_at,
      description,
      has_downloads,
      homepage,
      html_url,
      id,
      language,
      private:
      isPrivate,
      name,
      owner,
      size,
      stargazers_count,
      updated_at
    } = await response.json()

    return {
      allow_forking,
      archived,
      created_at,
      description,
      has_downloads,
      homepage,
      html_url,
      id,
      isPrivate,
      language,
      name,
      owner: owner.login,
      owner_url: owner.html_url,
      size,
      stargazers_count,
      updated_at
    } as RepositoryType
  } else {
    console.error(response)
    throw new Error(`Failed to fetch repository. ${response.status} ${response.statusText}`)
  }
}