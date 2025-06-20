import { useContext } from 'react'
import { Button } from '@/components'
import { RepositoryContext } from '@/context/repository'
import { SearchContext } from '@/context/search'

export const MockSearchConsumer = (): React.ReactNode => {
  const context = useContext(SearchContext)

  return (
    <>
      <div data-testid="results">{context.results.length}</div>
      <div data-testid="has-searched">{context.hasSearched ? 'has searched' : 'has not searched'}</div>
      <div data-testid="is-loading">{context.isLoading ? 'is loading' : 'is not loading'}</div>
      <div data-testid="search-term">{context.searchTerm}</div>
      <Button
        onClick={() => context.handleSearch('mock search term', false)}
        data-testid="search-button"
      >
        Search
      </Button>
    </>
  )
}

export const MockRepositoryConsumer = (): React.ReactNode => {
  const context = useContext(RepositoryContext)

  return (
    <>
      <div data-testid="is-loading">{context.isLoading ? 'is loading' : 'is not loading'}</div>
      <Button
        onClick={() => context.handleFetch('mock owner', 'mock name')}
        data-testid="fetch-button"
      >
        Search
      </Button>
    </>
  )
}