import { createContext, useCallback, useMemo, useState } from 'react'
import type { BasicRepositoryType } from '@/types/repository'
import { searchRepositories } from '@/api'

export type SearchHandler = (searchKeyword: string, filterPopular: boolean) => Promise<void>

export type SearchContextType = {
  filterPopular: boolean
  handleSearch: SearchHandler
  hasSearched: boolean
  isLoading: boolean
  repositories: BasicRepositoryType[]
  searchTerm: string
}

const defaultValue: SearchContextType = {
  filterPopular: false,
  handleSearch: async () => { },
  hasSearched: false,
  isLoading: false,
  repositories: [],
  searchTerm: '',
}

const SearchContext = createContext<SearchContextType>(defaultValue)

const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasSearched, setHasSearched] = useState(false)
  const [filterPopular, setFilterPopular] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [repositories, setRepositories] = useState<BasicRepositoryType[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch: SearchHandler = useCallback(async (searchKeyword, filterPopular) => {
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
        alert(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

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

export { SearchProvider, SearchContext }