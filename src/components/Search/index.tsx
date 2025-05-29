import { useContext, type FC } from 'react'
import Loader from '../Loader'
import SearchForm from './Form'
import SearchResults from './Results'
import { SearchContext } from '@/context/SearchContext'

const Search: FC = () => {
  const { handleSearch, hasSearched, isLoading, repositories } = useContext(SearchContext)

  return (
    <main id="search">
      <h1>GitHub Search</h1>
      <SearchForm disableForm={isLoading} onSubmit={handleSearch} data-testid="searchForm" />

      {!hasSearched && <p data-testid="noSearch">Enter a keyword to search GitHub.</p>}

      {hasSearched && (
        isLoading ? (
          <Loader data-testid="loader" />
        ) : (
          <div className="fade-up">
            <SearchResults data-testid="searchResults" items={repositories} />
          </div>
        )
      )}
    </main>
  )
}

export default Search
