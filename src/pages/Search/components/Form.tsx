import { useCallback, useContext, useState } from 'react'
import type { SearchHandler } from '@/context/search/types'
import { Button } from '@/components'
import { SearchContext } from '@/context/search'

export type SearchFormProps = {
  disableForm: boolean
  onFormSubmit: SearchHandler
} & React.HTMLAttributes<HTMLFormElement>

const Form: React.FC<SearchFormProps> = ({ disableForm, onFormSubmit, ...props }) => {
  const {
    filterPopular: savedFilterPopular,
    hasSearched,
    searchTerm: savedSearchTerm
  } = useContext(SearchContext)
  // Persist search settings from previous query
  const [filterPopular, setFilterPopular] = useState(() => hasSearched ? savedFilterPopular : false)
  const [searchKeyword, setSearchKeyword] = useState(() => hasSearched ? savedSearchTerm : '')

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()

    onFormSubmit(searchKeyword, filterPopular)
  }, [searchKeyword, filterPopular, onFormSubmit])

  return (
    <form onSubmit={handleFormSubmit} data-testid="form" {...props}>
      <fieldset disabled={disableForm} data-testid="fieldset">
        <input
          type="text"
          placeholder="Enter keyword"
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
          required
          data-testid="search-input"
        />
        <label>
          <input
            type="checkbox"
            checked={filterPopular}
            onChange={e => setFilterPopular(e.target.checked)}
            data-testid="popular-checkbox"
          />
          Popular
        </label>

        <Button type="submit" data-testid="submit-btn">Search</Button>
      </fieldset>
    </form>
  )
}

export default Form