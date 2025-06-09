import { useContext } from 'react'
import './Search.css'
import { SearchForm, SearchResults } from './components'
import { Loader } from '@/components'
import { SearchContext } from '@/context/search'

const Search: React.FC = () => {
  const { handleSearch, hasSearched, isLoading, repositories } = useContext(SearchContext)

  return (
    <main id="search">
      <h1>GitHub Search</h1>
      <SearchForm
        disableForm={isLoading}
        onFormSubmit={handleSearch}
        data-testid="searchForm"
      />

      {!hasSearched && <p data-testid="noSearch">Enter a keyword to search GitHub.</p>}

      {hasSearched && (
        isLoading ? (
          <Loader data-testid="loader" />
        ) : (
          <div className="fade-up">
            <SearchResults
              caption="Search results"
              headers={['Name', 'Description', 'Action']}
              items={repositories}
              data-testid="searchResults"
            />
          </div>
        )
      )}
    </main>
  )
}

export default Search