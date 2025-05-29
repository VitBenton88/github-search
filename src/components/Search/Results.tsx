import { useCallback, type FC } from 'react'
import type { BasicRepositoryType } from '@/types/repository'
import { useNavigate } from 'react-router-dom'

export type SearchResultsProps = {
  items: BasicRepositoryType[]
}

const Results: FC<SearchResultsProps> = ({ items, ...props }) => {
  const navigate = useNavigate()

  const handleClick = useCallback(async (owner: string, name: string) => {
    navigate(`/repo/${owner}/${name}`);
  }, [navigate])

  const formatDisplayDate = useCallback((isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString();
  }, [])

  if (!items.length) return (
    <p data-testid="noneFound">No repositories found.</p>
  );

  return (
    <div className='results-wrapper'>
      <table data-testid="table" {...props}>
        <caption>Search results</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ created_at, id, name, owner }) => (
            <tr key={id} data-testid="result">
              <td data-testid="name">{name}</td>
              <td>{formatDisplayDate(created_at)}</td>
              <td>
                <button
                  type="button"
                  aria-label={`View details for ${name} repository`}
                  onClick={() => handleClick(owner, name)}
                  data-testid="viewMoreBtn"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Results