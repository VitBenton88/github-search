import type { BasicRepositoryType, RepositoryType } from '@/types/repository.js'

export const mockRepo: RepositoryType = {
  id: '1',
  name: 'mock-repo',
  stargazers_count: 42,
  description: 'A test repo',
  owner: 'mock-owner',
  owner_url: 'https://github.com/mock-owner',
  created_at: '1980-01-01T00:00:00.000Z',
  updated_at: '1981-01-01T00:00:00.000Z',
  language: 'TypeScript',
  size: 1234,
  has_downloads: true,
  allow_forking: false,
  archived: false,
  isPrivate: false,
  homepage: 'https://example.com',
  html_url: 'https://github.com/mock-owner/mock-repo'
}

export const mockBasicRepo: BasicRepositoryType = {
  id: mockRepo.id, name: mockRepo.name, created_at: mockRepo.created_at, owner: mockRepo.owner
}

export const mockBasicRepos: BasicRepositoryType[] = [
  mockBasicRepo,
  {
    id: '2', name: 'mock-repo2', created_at: '2013-12-04T04:02:55Z', owner: 'mock-owner2'
  }
]