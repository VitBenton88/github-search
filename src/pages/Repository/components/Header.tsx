import { useContext } from 'react'
import { Link } from '@/components'
import { RepositoryContext } from '@/context/repository'

type HeaderProps = React.HTMLAttributes<HTMLDivElement>

const Header: React.FC<HeaderProps> = ({ ...props }) => {
  const { repository } = useContext(RepositoryContext)
  const {
    created_at,
    description,
    name,
    owner,
    owner_url,
    stargazers_count,
    updated_at
  } = repository

  const formatDisplayDate = (isoString: string): string => new Date(isoString).toLocaleString()

  return (
    <header {...props}>
      <h1 data-testid="title">{name}</h1>
      <small aria-label={`${stargazers_count} stars`} data-testid="star-count">⭐ {stargazers_count}</small>
      {description?.trim() && (
        <p data-testid="description">{description}</p>
      )}
      <p>Owner: <Link href={owner_url} data-testid="owner-link">{owner} &rarr;</Link></p>
      <p data-testid="created">Created: {formatDisplayDate(created_at)}</p>
      <p data-testid="updated">Updated: {formatDisplayDate(updated_at)}</p>
    </header>
  )
}

export default Header