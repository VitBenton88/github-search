import { useCallback, useMemo, useRef, useState } from 'react'
import type { FetchHandler, RepositoryContextType, RepositoryType } from '@/context/repository/types'
import { getRepository } from '@/api'
import { RepositoryContext } from '@/context/repository'
import { defaultRepositoryContext } from '@/context/repository/repository.constants'
import { useNotification } from '@/hooks/useNotification'

const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notify = useNotification()
  const [isLoading, setIsLoading] = useState(true)
  const [repository, setRepository] = useState<RepositoryType>(defaultRepositoryContext.repository)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleFetch: FetchHandler = useCallback(async (owner, name) => {
    // Cancel any still-in-flight fetch so its response can't overwrite this one.
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    try {
      const fetchedRepository = await getRepository(owner, name, controller.signal)

      // A newer fetch has since started; discard this now-stale response.
      if (abortControllerRef.current !== controller) return

      setRepository(fetchedRepository)
    } catch (error) {
      if (abortControllerRef.current !== controller) return

      if (error instanceof Error) {
        notify(error.message, 'error')
      }
    } finally {
      // Only the most recent request should be allowed to clear the loading state.
      if (abortControllerRef.current === controller) {
        setIsLoading(false)
      }
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