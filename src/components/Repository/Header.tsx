import { useCallback, type FC } from 'react'
import ExternalLink from '@/components/ExternalLink'
import type { RepositoryType } from '@/types/repository'

export type HeaderProps = {
  repository: RepositoryType
}

const Header: FC<HeaderProps> = ({ repository, ...props }) => {
  const formatDisplayDate = useCallback((isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString();
  }, [])

  return (
    <header {...props}>
      <h1 data-testid="title">{repository.name}</h1>
      <small aria-label={`${repository.stargazers_count} stars`} data-testid="star-count">⭐ {repository.stargazers_count}</small>
      {!!repository.description &&
        (<h2 data-testid="description">{repository.description}</h2>)
      }
      <h3>Owner: <ExternalLink data-testid="owner-link" href={repository.owner_url}>{repository.owner} &rarr;</ExternalLink></h3>
      <h4 data-testid="created">Created: {formatDisplayDate(repository.created_at)}</h4>
      <h4 data-testid="updated">Updated: {formatDisplayDate(repository.updated_at)}</h4>
    </header>
  )
}

export default Header