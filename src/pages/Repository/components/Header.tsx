import { type FC, type HTMLAttributes, useCallback, useContext } from 'react'
import Link from '@/components/Link'
import { RepositoryContext } from '@/context/RepositoryContext'

type HeaderProps = HTMLAttributes<HTMLDivElement>

const Header: FC<HeaderProps> = ({ ...props }) => {
  const { repository } = useContext(RepositoryContext)
  const {
    created_at,
    description,
    name,
    owner,
    owner_url, stargazers_count,
    updated_at
  } = repository

  const formatDisplayDate = useCallback((isoString: string): string => {
    const date = new Date(isoString)
    return date.toLocaleString()
  }, [])

  return (
    <header {...props}>
      <h1 data-testid="title">{name}</h1>
      <small aria-label={`${stargazers_count} stars`} data-testid="star-count">⭐ {stargazers_count}</small>
      {description?.trim() &&
        (<h2 data-testid="description">{description}</h2>)
      }
      <h3>Owner: <Link href={owner_url} data-testid="owner-link">{owner} &rarr;</Link></h3>
      <h4 data-testid="created">Created: {formatDisplayDate(created_at)}</h4>
      <h4 data-testid="updated">Updated: {formatDisplayDate(updated_at)}</h4>
    </header>
  )
}

export default Header