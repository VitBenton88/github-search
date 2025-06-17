import { mockRepoApiResponse } from '@mocks/api'
import type { RepositoryType } from '@/context/repository/types'
import type { BasicRepositoryType } from '@/context/search/types'

const {
  id, name, stargazers_count, description, owner, created_at, updated_at, language, size, has_downloads, allow_forking, archived, private: isPrivate, homepage, html_url
} = mockRepoApiResponse

export const mockRepo: RepositoryType = {
  id,
  name,
  stargazers_count,
  description,
  owner: owner.login,
  owner_url: owner.html_url,
  created_at,
  updated_at,
  language,
  size,
  has_downloads,
  allow_forking,
  archived,
  isPrivate,
  homepage,
  html_url
}

export const mockBasicRepo: BasicRepositoryType = {
  id: mockRepo.id, name: mockRepo.name, description: mockRepo.description, owner: mockRepo.owner
}

export const mockBasicRepos: BasicRepositoryType[] = [
  mockBasicRepo,
  {
    id: 2, name: 'mock-repo', description: 'mock description', owner: 'mock-owner'
  }
]