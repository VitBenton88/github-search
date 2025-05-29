import type { RepositoryType, BasicRepositoryType } from '@/types/repository.js'

export const mockRepo: RepositoryType = {
  id: '1',
  name: 'mock-repo',
  stargazers_count: 42,
  description: 'A test repo',
  owner: 'mock-owner',
  owner_url: 'https://github.com/mock-owner',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  language: 'TypeScript',
  size: 1234,
  has_downloads: true,
  allow_forking: false,
  archived: false,
  isPrivate: false,
  homepage: 'https://example.com',
  html_url: 'https://github.com/mock-owner/mock-repo'
}

export const mockBasicRepos: BasicRepositoryType[] = [
  {
    id: '1', name: 'mock-repo', created_at: '2014-12-04T04:02:55Z', owner: 'mock-owner'
  },
  {
    id: '2', name: 'mock-repo2', created_at: '2013-12-04T04:02:55Z', owner: 'mock-owner'
  }
]