import { useCallback, useMemo, useState } from 'react'
import { SearchContext } from './SearchContext'
import type { BasicRepositoryType } from '@/pages/Repository/types'
import type { SearchRepositoriesHandler } from '@/pages/Search/types'
import { searchRepositories } from '@/api'
import { useNotification } from '@/hooks/useNotification'

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      console.error(error)
      if (error instanceof Error) {
        notify(error.message, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }, [notify])

  const contextValue = useMemo(() => ({
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