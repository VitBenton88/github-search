import { type FC, type HTMLAttributes, useCallback, useContext, useState } from 'react'
import { SearchContext, type SearchHandler } from '@/context/SearchContext'

export type SearchFormProps = {
  disableForm: boolean
  onFormSubmit: SearchHandler
} & HTMLAttributes<HTMLFormElement>

const Form: FC<SearchFormProps> = ({ disableForm, onFormSubmit, ...props }) => {
  const { searchTerm: savedSearchTerm } = useContext(SearchContext)
  const [filterPopular, setFilterPopular] = useState(false)
  // Persist search keyword from previous query
  const [searchKeyword, setSearchKeyword] = useState(() => savedSearchTerm || '')

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
          data-testid="searchInput"
        />
        <label>
          <input
            type="checkbox"
            checked={filterPopular}
            onChange={e => setFilterPopular(e.target.checked)}
            data-testid="popularCheckbox"
          />
          Popular
        </label>

        <button type="submit" data-testid="submitBtn">Search</button>
      </fieldset>
    </form>
  )
}

export default Form