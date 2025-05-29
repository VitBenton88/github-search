import { useCallback, useContext, useEffect, useState, type FC } from 'react'
import { SearchContext, type SearchHandler } from '@/context/SearchContext'

export type SearchFormProps = {
  disableForm: boolean
  onSubmit: SearchHandler
}

const Form: FC<SearchFormProps> = ({ disableForm, onSubmit, ...props }) => {
  const [filterPopular, setFilterPopular] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const { searchTerm: savedSearchTerm } = useContext(SearchContext)

  useEffect(() => {
    // Persist search keyword from previous query
    setSearchKeyword(savedSearchTerm);
  }, [savedSearchTerm])

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(searchKeyword, filterPopular);
  }, [searchKeyword, filterPopular, onSubmit])

  return (
    <form onSubmit={handleFormSubmit} data-testid="form" {...props}>
      <fieldset disabled={disableForm} data-testid="fieldset">
        <input
          type="text"
          placeholder="Enter keyword"
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          required
          data-testid="searchInput"
        />
        <label>
          <input
            type="checkbox"
            checked={filterPopular}
            onChange={e => setFilterPopular(e.target.checked)}
          />
          Popular
        </label>

        <button type="submit" data-testid="submitBtn">Search</button>
      </fieldset>
    </form>
  )
}

export default Form