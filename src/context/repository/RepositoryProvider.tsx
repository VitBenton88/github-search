import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FetchHandler, RepositoryContextType, RepositoryType } from '@/context/repository/types'
import { getRepository } from '@/api'
import { RepositoryContext } from '@/context/repository'
import { defaultRepositoryContext } from '@/context/repository/repository.constants'
import { useNotification } from '@/hooks/useNotification'

const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notify = useNotification()
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [repository, setRepository] = useState<RepositoryType>(defaultRepositoryContext.repository)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleFetch: FetchHandler = useCallback(async (owner, name) => {
    // Cancel any still-in-flight fetch so its response can't overwrite this one.
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setFetchError(null)
    setIsLoading(true)
    try {
      const fetchedRepository = await getRepository(owner, name, controller.signal)

      // Aborted by a newer fetch or by unmounting; discard this now-stale response.
      if (controller.signal.aborted) return

      setRepository(fetchedRepository)
    } catch (error) {
      if (controller.signal.aborted) return

      if (error instanceof Error) {
        setFetchError(error.message)
        notify(error.message, 'error')
      }
    } finally {
      // Only the most recent request should be allowed to clear the loading state.
      if (!controller.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [notify])

  // Cancel any in-flight fetch on unmount (e.g. navigating back to search), so a late
  // failure can't raise an error toast for a repository the user has already left.
  useEffect(() => () => abortControllerRef.current?.abort(), [])

  const contextValue = useMemo((): RepositoryContextType => ({
    error: fetchError,
    handleFetch,
    isLoading,
    repository,
  }), [fetchError, handleFetch, isLoading, repository])

  return (
    <RepositoryContext.Provider value={contextValue}>
      {children}
    </RepositoryContext.Provider>
  )
}

export default RepositoryProvider