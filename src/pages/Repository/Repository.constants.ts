export const REPO_LABELS = {
  ALLOWS_FORKING: 'Allows forking',
  ARCHIVED: 'Archived',
  FORBIDS_FORKING: 'Does not allow forking',
  HAS_DOWNLOADS: 'Has downloads',
  NO_DOWNLOADS: 'No downloads',
  NOT_ARCHIVED: 'Not archived',
  PRIVATE: 'Private',
  PUBLIC: 'Public',
} as const

import type { RepositoryType } from '@/types/repository'

export const defaultRepository: RepositoryType = {
  description: '',
  id: '',
  name: '',
  owner: '',
  allow_forking: false,
  archived: false,
  created_at: '',
  has_downloads: false,
  homepage: '',
  html_url: '',
  isPrivate: false,
  language: '',
  owner_url: '',
  size: 0,
  stargazers_count: 0,
  updated_at: '',
} as const