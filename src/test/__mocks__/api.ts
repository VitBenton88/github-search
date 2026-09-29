import type { RepositoryApiResponse } from '@/api/types'

export const mockRepoApiResponse: RepositoryApiResponse = {
  allow_forking: false,
  archived: false,
  created_at: '2011-01-26T19:01:12Z',
  description: 'This is your first repo!',
  has_downloads: true,
  homepage: 'https://github.com',
  html_url: 'https://github.com/octocat/Hello-World',
  id: 1296269,
  language: 'TypeScript',
  name: 'Hello-World',
  owner: {
    html_url: 'https://github.com/octocat',
    login: 'octocat'
  },
  private: false,
  size: 108,
  stargazers_count: 80,
  updated_at: '2011-01-26T19:14:43Z'
}
