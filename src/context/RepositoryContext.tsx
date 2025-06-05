import { createContext, useCallback, useMemo, useState } from 'react'
import type { fetchRepositoryHandler, RepositoryType } from '@/pages/Repository/types'
import { getRepository } from '@/api'
import { defaultRepository } from '@/pages/Repository/repository.constants'
import type { RepositoryContextType } from './types'

const defaultValue: RepositoryContextType = {
  handleFetch: async () => { },
  isLoading: true,
  repository: defaultRepository,
}

const RepositoryContext = createContext<RepositoryContextType>(defaultValue)

const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [repository, setRepository] = useState<RepositoryType>(defaultValue.repository)

  const handleFetch: fetchRepositoryHandler = useCallback(async (owner, name) => {
    try {
      const fetchedRepository = await getRepository(owner, name)
      setRepository(fetchedRepository)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const contextValue = useMemo(() => ({
    handleFetch,
    isLoading,
    repository,
  }), [handleFetch, isLoading, repository])

  return (
    <RepositoryContext.Provider value={contextValue}>
      {children}
    </RepositoryContext.Provider>
  )
}

export { RepositoryProvider, RepositoryContext }