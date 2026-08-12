import { useCallback, useMemo, useRef, useState } from 'react'
import type { SearchContextType, SearchHandler } from '@/context/search/types'
import type { SearchResultType } from '@/context/search/types'
import { searchRepositories } from '@/api'
import { SearchContext } from '@/context/search'
import { useNotification } from '@/hooks/useNotification'

const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notify = useNotification()
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filterPopular, setFilterPopular] = useState(false)
  const [results, setResults] = useState<SearchResultType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleSearch: SearchHandler = useCallback(async (searchKeyword, filterPopular) => {
    // Cancel any still-in-flight search so its response can't overwrite this one.
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setFilterPopular(filterPopular)
    setHasSearched(true)
    setIsLoading(true)
    setResults([])
    setSearchTerm(searchKeyword)

    try {
      const reposFetch = await searchRepositories(searchKeyword, filterPopular, controller.signal)

      // A newer search has since started; discard this now-stale response.
      if (abortControllerRef.current !== controller) return

      setResults(reposFetch)
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

  const contextValue = useMemo((): SearchContextType => ({
    filterPopular,
    handleSearch,
    hasSearched,
    isLoading,
    results,
    searchTerm,
  }), [filterPopular, handleSearch, hasSearched, isLoading, results, searchTerm])

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  )
}

export default SearchProvider