import { useCallback, useMemo, useState } from 'react'
import { defaultValue, RepositoryContext } from './RepositoryContext'
import type { fetchRepositoryHandler, RepositoryType } from '@/pages/Repository/types'
import { getRepository } from '@/api'
import { useNotification } from '@/hooks/useNotification'

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notify = useNotification()
  const [isLoading, setIsLoading] = useState(true)
  const [repository, setRepository] = useState<RepositoryType>(defaultValue.repository)

  const handleFetch: fetchRepositoryHandler = useCallback(async (owner, name) => {
    try {
      const fetchedRepository = await getRepository(owner, name)
      setRepository(fetchedRepository)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        notify(error.message, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }, [notify])

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