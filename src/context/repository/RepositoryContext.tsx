import { createContext } from 'react'
import type { RepositoryContextType } from '../types'
import { defaultRepository } from '@/pages/Repository/repository.constants'

export const defaultValue: RepositoryContextType = {
  handleFetch: async () => { },
  isLoading: true,
  repository: defaultRepository,
}

export const RepositoryContext = createContext<RepositoryContextType>(defaultValue)