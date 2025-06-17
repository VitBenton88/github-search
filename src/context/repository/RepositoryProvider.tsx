import { useCallback, useMemo, useState } from 'react'
import type { fetchRepositoryHandler, RepositoryContextType } from '@/context/repository/types'
import type { RepositoryType } from '@/pages/Repository/types'
import { getRepository } from '@/api'
import { RepositoryContext } from '@/context/repository'
import { defaultRepositoryContext } from '@/context/repository/repository.constants'
import { useNotification } from '@/hooks/useNotification'

const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notify = useNotification()
  const [isLoading, setIsLoading] = useState(true)
  const [repository, setRepository] = useState<RepositoryType>(defaultRepositoryContext.repository)

  const handleFetch: fetchRepositoryHandler = useCallback(async (owner, name) => {
    try {
      const fetchedRepository = await getRepository(owner, name)
      setRepository(fetchedRepository)
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }, [notify])

  const contextValue = useMemo((): RepositoryContextType => ({
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

export default RepositoryProvider