import { type FC, useContext } from 'react'
import './index.css'
import Loader from '../Loader'
import SearchForm from './Form'
import SearchResults from './Results'
import { SearchContext } from '@/context/SearchContext'
import { useLocation } from 'react-router-dom'

const Search: FC = () => {
  const { handleSearch, hasSearched, isLoading, repositories } = useContext(SearchContext)
  const location = useLocation()
  const error = location.state?.error

  return (
    <main id="search">
      {!!error && <p data-testid="pageNotFound" >{error}</p>}
      <h1>GitHub Search</h1>
      <SearchForm disableForm={isLoading} onFormSubmit={handleSearch} data-testid="searchForm" />

      {!hasSearched && <p data-testid="noSearch">Enter a keyword to search GitHub.</p>}

      {hasSearched && (
        isLoading ? (
          <Loader data-testid="loader" />
        ) : (
          <div className="fade-up">
            <SearchResults
              caption="Search results"
              items={repositories}
              data-testid="searchResults" />
          </div>
        )
      )}
    </main>
  )
}

export default Search
