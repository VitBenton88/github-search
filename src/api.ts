import type { BasicRepositoryType, RepositoryType } from '@/types/repository'

const BASE_URL = 'https://api.github.com';

/**
 * Search repositories.
 * @param {string} searchKeyword - Keyword for search query.
 * @param {boolean} popularFilter - Filter search query for popular repositories (>1k stars).
 * @returns {BasicRepositoryType[]}
 */
export const searchRepositories = async (searchKeyword = '', popularFilter = false): Promise<BasicRepositoryType[]> => {
  let fetchUrl = `${BASE_URL}/search/repositories?q=${searchKeyword}`;

  if (popularFilter) {
    fetchUrl += '+stars:>1000'
  }

  const response = await fetch(fetchUrl);

  if (response.ok) {
    const { items } = await response.json();

    return items.map((repo: { created_at: string; id: string; name: string; owner: { login: string }; }) => ({
      created_at: repo.created_at,
      id: repo.id,
      name: repo.name,
      owner: repo.owner.login,
    }))
  } else {
    throw new Error(`Failed to search repositories. ${response.status} ${response.statusText}`);
  }
}

/**
 * Get an individual repository's data.
 * @param {string} owner - Name of repository's owner.
 * @param {string} name - Repository's name.
 * @returns {RepositoryType}
 */
export const getRepository = async (owner = '', name = ''): Promise<RepositoryType> => {
  let fetchUrl = `${BASE_URL}/repos/${owner}/${name}`;

  const response = await fetch(fetchUrl);

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
    } = await response.json();

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
    }
  } else {
    throw new Error(`Failed to fetch repository. ${response.status} ${response.statusText}`);
  }
}