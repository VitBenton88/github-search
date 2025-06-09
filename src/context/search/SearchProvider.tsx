import { useCallback, useMemo, useState } from 'react'
import type { SearchContextType } from '@/context/types'
import type { BasicRepositoryType } from '@/pages/Repository/types'
import type { SearchRepositoriesHandler } from '@/pages/Search/types'
import { searchRepositories } from '@/api'
import { SearchContext } from '@/context/search'
import { useNotification } from '@/hooks/useNotification'

const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notify = useNotification()
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filterPopular, setFilterPopular] = useState(false)
  const [repositories, setRepositories] = useState<BasicRepositoryType[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch: SearchRepositoriesHandler = useCallback(async (searchKeyword, filterPopular) => {
    setFilterPopular(filterPopular)
    setHasSearched(true)
    setIsLoading(true)
    setRepositories([])
    setSearchTerm(searchKeyword)

    try {
      const reposFetch = await searchRepositories(searchKeyword, filterPopular)
      setRepositories(reposFetch)
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
    repositories,
    searchTerm,
  }), [filterPopular, handleSearch, hasSearched, isLoading, repositories, searchTerm])

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  )
}

export default SearchProvider