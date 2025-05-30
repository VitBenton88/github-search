import { createContext, type ReactNode, useCallback, useMemo, useState } from 'react'
import type { BasicRepositoryType } from '@/types/repository'
import { searchRepositories } from '@/api'

export type SearchHandler = (searchKeyword: string, filterPopular: boolean) => Promise<void>

export type SearchContextType = {
  repositories: BasicRepositoryType[]
  handleSearch: SearchHandler
  hasSearched: boolean
  isLoading: boolean
  searchTerm: string
}

const defaultValue: SearchContextType = {
  repositories: [],
  handleSearch: async () => { },
  hasSearched: false,
  isLoading: false,
  searchTerm: '',
}

const SearchContext = createContext<SearchContextType>(defaultValue)

const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [repositories, setRepositories] = useState<BasicRepositoryType[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch: SearchHandler = useCallback(async (searchKeyword, filterPopular) => {
    setHasSearched(true);
    setIsLoading(true);
    setRepositories([]);
    setSearchTerm(searchKeyword);

    try {
      const reposFetch = await searchRepositories(searchKeyword, filterPopular);
      setRepositories(reposFetch);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [])

  const contextValue = useMemo(() => ({
    handleSearch,
    hasSearched,
    isLoading,
    repositories,
    searchTerm,
  }), [handleSearch, hasSearched, isLoading, repositories, searchTerm])

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  )
}

export { SearchProvider, SearchContext }