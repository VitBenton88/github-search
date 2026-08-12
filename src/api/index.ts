import type { GetRepoHandler, RepositoryApiResponse, SearchReposHandler } from '@/api/types'
import type { SearchResultType } from '@/context/search/types'

const BASE_URL = 'https://api.github.com'

const isRateLimited = (response: Response): boolean =>
  (response.status === 403 || response.status === 429) && response.headers.get('x-ratelimit-remaining') === '0'

/**
 * Build a user-facing error message for a failed response, special-casing
 * GitHub's rate limit so it isn't confused with a generic request failure.
 */
const buildErrorMessage = (action: string, response: Response): string => {
  if (isRateLimited(response)) {
    const resetHeader = response.headers.get('x-ratelimit-reset')
    const resetTime = resetHeader ? new Date(Number(resetHeader) * 1000).toLocaleTimeString() : null

    return resetTime
      ? `GitHub API rate limit exceeded. Try again after ${resetTime}.`
      : 'GitHub API rate limit exceeded. Please try again later.'
  }

  return `Failed to ${action}. ${response.status} ${response.statusText}`
}

/**
 * Search repositories.
 * @param searchKeyword - Keyword for search query.
 * @param popularFilter - Filter search query for popular repositories (>1k stars).
 * @param signal - Optional AbortSignal to cancel the request.
 */
export const searchRepositories: SearchReposHandler = async (searchKeyword = '', popularFilter = false, signal) => {
  const url = new URL(`${BASE_URL}/search/repositories`)
  url.searchParams.set('q', searchKeyword)

  if (popularFilter) {
    url.searchParams.set('q', `${searchKeyword} stars:>1000`)
  }

  const fetchUrl = url.toString()
  const response = await fetch(fetchUrl, { signal })

  if (response.ok) {
    const { items } = await response.json()

    return items.map(
      (repo: RepositoryApiResponse): SearchResultType => ({
        description: repo.description,
        id: repo.id,
        name: repo.name,
        owner: repo.owner.login
      })
    )
  } else {
    throw new Error(buildErrorMessage('search repositories', response))
  }
}

/**
 * Get an individual repository's data.
 * @param owner - Name of repository's owner.
 * @param name - Repository's name.
 * @param signal - Optional AbortSignal to cancel the request.
 */
export const getRepository: GetRepoHandler = async (owner = '', name = '', signal) => {
  const url = new URL(`${BASE_URL}/repos/${owner}/${name}`)

  const fetchUrl = url.toString()
  const response = await fetch(fetchUrl, { signal })

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
      owner: repoOwner,
      size,
      stargazers_count,
      updated_at
    }: RepositoryApiResponse = await response.json()

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
      owner: repoOwner.login,
      owner_url: repoOwner.html_url,
      size,
      stargazers_count,
      updated_at
    }
  } else {
    throw new Error(buildErrorMessage('fetch repository', response))
  }
}