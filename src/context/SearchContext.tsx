import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import type { BasicRepositoryType } from '@/types/repository'
import { searchRepositories } from '@/api'

export type SearchContextType = {
  repositories: BasicRepositoryType[]
  handleSearch: Function
  hasSearched: boolean
  isLoading: boolean
  searchTerm: string
}

const defaultValue: SearchContextType = {
  repositories: [],
  handleSearch: () => { },
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

  const handleSearch = useCallback(async (searchKeyword: string, filterPopular: boolean): Promise<void> => {
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
