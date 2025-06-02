import { type FC, type HTMLAttributes, useCallback } from 'react'
import type { BasicRepositoryType } from '@/types/repository'
import { useNavigate } from 'react-router-dom'

export type SearchResultsProps = {
  items: BasicRepositoryType[]
} & HTMLAttributes<HTMLDivElement>

const Results: FC<SearchResultsProps> = ({ items, ...props }) => {
  const navigate = useNavigate()

  const handleClick = useCallback((owner: string, name: string) => navigate(`/repo/${owner}/${name}`), [navigate])

  const renderTableRow = (repo: BasicRepositoryType) => (
    <tr key={repo.id} data-testid="result">
      <td data-testid="name">{repo.name}</td>
      <td>{repo.description}</td>
      <td>
        <button
          type="button"
          aria-label={`View details for ${repo.name} repository`}
          onClick={() => handleClick(repo.owner, repo.name)}
          data-testid="viewMoreBtn"
        >
          View
        </button>
      </td>
    </tr>
  )

  if (!items.length) return (<p data-testid="noneFound">No repositories found.</p>)

  return (
    <div className="results-wrapper" {...props}>
      <table data-testid="table">

        <caption>Search results</caption>

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