import { type FC, type HTMLAttributes, useCallback } from 'react'
import type { BasicRepositoryType } from '@/types/repository'
import { useNavigate } from 'react-router-dom'

export type SearchResultsProps = {
  items: BasicRepositoryType[]
} & HTMLAttributes<HTMLDivElement>

const Results: FC<SearchResultsProps> = ({ items, ...props }) => {
  const navigate = useNavigate()

  const handleClick = useCallback((owner: string, name: string) => navigate(`/repo/${owner}/${name}`), [navigate])

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
          {items.map(({ description, id, name, owner }) => (
            <tr key={id} data-testid="result">
              <td data-testid="name">{name}</td>
              <td>{description}</td>
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