import { createContext } from 'react'
import type { RepositoryContextType } from '@/context/types'
import { defaultRepository } from '@/pages/Repository/repository.constants'

export const defaultValue: RepositoryContextType = {
  handleFetch: async () => { },
  isLoading: true,
  repository: defaultRepository,
}

const RepositoryContext = createContext<RepositoryContextType>(defaultValue)

export default RepositoryContext