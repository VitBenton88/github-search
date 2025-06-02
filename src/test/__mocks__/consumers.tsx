import Button from '@/components/Button'
import { SearchContext } from '@/context/SearchContext'
import { useContext } from 'react'

export const MockSearchConsumer = (): React.ReactNode => {
  const context = useContext(SearchContext)

  return (
    <>
      <div data-testid="repositories">{context.repositories.length}</div>
      <div data-testid="hasSearched">{context.hasSearched ? 'has searched' : 'has not searched'}</div>
      <div data-testid="isLoading">{context.isLoading ? 'is loading' : 'is not loading'}</div>
      <div data-testid="searchTerm">{context.searchTerm}</div>
      <Button
        onClick={() => context.handleSearch('mock search term', false)}
        data-testid="search-button"
      >
        Search
      </Button>
    </>
  )
}