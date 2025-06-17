import { mockRepoApiResponse } from '@mocks/api'
import type { RepositoryType } from '@/context/repository/types'
import type { SearchResultType } from '@/context/search/types'

const {
  id, name, stargazers_count, description, owner, created_at, updated_at, language, size, has_downloads, allow_forking, archived, private: isPrivate, homepage, html_url
} = mockRepoApiResponse

export const mockRepository: RepositoryType = {
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

export const mockSearchResult: SearchResultType = {
  id: mockRepository.id, name: mockRepository.name, description: mockRepository.description, owner: mockRepository.owner
}

export const mockMultipleSearchResults: SearchResultType[] = [
  mockSearchResult,
  {
    id: 2, name: 'mock-repo', description: 'mock description', owner: 'mock-owner'
  }
]