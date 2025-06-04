import { createContext, type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import type { RepositoryType } from '@/types/repository'
import { getRepository } from '@/api'
import { defaultRepository } from '@/pages/Repository/repository.constants'

export type fetchHandler = (owner: string, name: string) => Promise<void>

export type RepositoryContextType = {
  handleFetch: fetchHandler,
  repository: RepositoryType
  isLoading: boolean
}

const defaultValue: RepositoryContextType = {
  handleFetch: async () => { },
  isLoading: true,
  repository: defaultRepository,
}

const RepositoryContext = createContext<RepositoryContextType>(defaultValue)

const RepositoryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [repository, setRepository] = useState<RepositoryType>(defaultValue.repository)

  const handleFetch: fetchHandler = useCallback(async (owner, name) => {
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