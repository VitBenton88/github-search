import { createContext } from 'react'
import { defaultRepository } from '@/pages/Repository/repository.constants'
import type { RepositoryContextType } from '../types'

export const defaultValue: RepositoryContextType = {
  handleFetch: async () => { },
  isLoading: true,
  repository: defaultRepository,
}

export const RepositoryContext = createContext<RepositoryContextType>(defaultValue)