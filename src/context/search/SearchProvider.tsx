import { useCallback, useMemo, useState } from 'react'
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

  const handleSearch: SearchHandler = useCallback(async (searchKeyword, filterPopular) => {
    setFilterPopular(filterPopular)
    setHasSearched(true)
    setIsLoading(true)
    setResults([])
    setSearchTerm(searchKeyword)

    try {
      const reposFetch = await searchRepositories(searchKeyword, filterPopular)
      setResults(reposFetch)
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message, 'error')
      }
    } finally {
      setIsLoading(false)
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