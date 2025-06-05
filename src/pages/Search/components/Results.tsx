import { useCallback } from 'react'
import type { BasicRepositoryType } from '@/pages/Repository/types'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components'

export type SearchResultsProps = {
  caption: string,
  items: BasicRepositoryType[]
} & React.HTMLAttributes<HTMLDivElement>

const Results: React.FC<SearchResultsProps> = ({ caption = '', items = [], ...props }) => {
  const navigate = useNavigate()

  const handleClick = useCallback((owner: string, name: string) => navigate(`/repo/${owner}/${name}`), [navigate])

  const renderTableRow = (repo: BasicRepositoryType) => (
    <tr key={repo.id} data-testid="result">
      <td data-testid="name">{repo.name}</td>
      <td>{repo.description}</td>
      <td>
        <Button
          type="button"
          aria-label={`View details for ${repo.name} repository`}
          onClick={() => handleClick(repo.owner, repo.name)}
          data-testid="viewMoreBtn"
        >
          View
        </Button>
      </td>
    </tr>
  )

  if (!items.length) return (<p data-testid="noneFound">No repositories found.</p>)

  return (
    <div className="results-wrapper" {...props}>
      <table data-testid="table">

        {caption && (<caption data-testid="caption">{caption}</caption>)}

        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map(renderTableRow)}
        </tbody>

      </table>
    </div>
  )
}

export default Results