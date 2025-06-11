import { type JSX, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BasicRepositoryType } from '@/pages/Repository/types'
import { Button } from '@/components'

export type SearchResultsProps = {
  caption: string,
  headers: string[]
  items: BasicRepositoryType[]
} & React.HTMLAttributes<HTMLDivElement>

const Results: React.FC<SearchResultsProps> = ({ caption = '', headers = [], items = [], ...props }) => {
  const navigate = useNavigate()

  const handleClick = useCallback((owner: string, name: string) => navigate(`/repo/${owner}/${name}`), [navigate])

  const renderTableRow = (repo: BasicRepositoryType): JSX.Element => (
    <tr key={repo.id} data-testid="result">
      <td data-testid="name">{repo.name}</td>
      <td>{repo.description}</td>
      <td>
        <Button
          aria-label={`View details for ${repo.name} repository`}
          type="button"
          onClick={() => handleClick(repo.owner, repo.name)}
          data-testid="view-more-btn"
        >
          View
        </Button>
      </td>
    </tr>
  )

  if (!items.length) return (<p data-testid="none-found">No repositories found.</p>)

  return (
    <div className="results-wrapper" {...props}>
      <table data-testid="table">

        {caption && (<caption data-testid="caption">{caption}</caption>)}

        {headers.length > 0 && (
          <thead data-testid="table-head">
            <tr>
              {headers.map(header => (
                <th key={header} data-testid="table-header">{header}</th>
              ))}
            </tr>
          </thead>
        )}

        <tbody>
          {items.map(renderTableRow)}
        </tbody>

      </table>
    </div>
  )
}

export default Results