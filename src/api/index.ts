import type { GetRepoHandler, RepositoryApiResponse, SearchReposHandler } from '@/api/types'
import type { SearchResultType } from '@/context/search/types'

const BASE_URL = 'https://api.github.com'

const isRateLimited = (response: Response): boolean =>
  (response.status === 403 || response.status === 429) && response.headers.get('x-ratelimit-remaining') === '0'

// GitHub owner and repository names only use these characters; '.' and '..' are not valid names.
const isValidPathSegment = (segment: string): boolean =>
  /^[\w.-]+$/.test(segment) && segment !== '.' && segment !== '..'

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
export const searchRepositories: SearchReposHandler = async (searchKeyword, popularFilter, signal) => {
  const url = new URL(`${BASE_URL}/search/repositories`)
  url.searchParams.set('q', popularFilter ? `${searchKeyword} stars:>1000` : searchKeyword)

  const response = await fetch(url.toString(), { signal })

  if (response.ok) {
    const { items } = await response.json() as { items: RepositoryApiResponse[] }

    return items.map(
      (repo): SearchResultType => ({
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
export const getRepository: GetRepoHandler = async (owner, name, signal) => {
  // owner/name come straight from the URL; refuse anything that could redirect the request
  // to a different API path (e.g. '..' segments, or '?'/'#' decoded from the route).
  if (!isValidPathSegment(owner) || !isValidPathSegment(name)) {
    throw new Error('Repository not found.')
  }

  const response = await fetch(`${BASE_URL}/repos/${owner}/${name}`, { signal })

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
    } = await response.json() as RepositoryApiResponse

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
  } else if (response.status === 404) {
    throw new Error('Repository not found.')
  } else {
    throw new Error(buildErrorMessage('fetch repository', response))
  }
}