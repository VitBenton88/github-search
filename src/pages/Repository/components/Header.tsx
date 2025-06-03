import { type FC, type HTMLAttributes, useCallback } from 'react'
import Link from '@/components/Link'
import type { RepositoryType } from '@/types/repository'

export type HeaderProps = {
  repository: RepositoryType
} & HTMLAttributes<HTMLDivElement>

const Header: FC<HeaderProps> = ({ repository, ...props }) => {
  const formatDisplayDate = useCallback((isoString: string): string => {
    const date = new Date(isoString)
    return date.toLocaleString()
  }, [])

  return (
    <header {...props}>
      <h1 data-testid="title">{repository.name}</h1>
      <small aria-label={`${repository.stargazers_count} stars`} data-testid="star-count">⭐ {repository.stargazers_count}</small>
      {repository.description?.trim() &&
        (<h2 data-testid="description">{repository.description}</h2>)
      }
      <h3>Owner: <Link href={repository.owner_url} data-testid="owner-link">{repository.owner} &rarr;</Link></h3>
      <h4 data-testid="created">Created: {formatDisplayDate(repository.created_at)}</h4>
      <h4 data-testid="updated">Updated: {formatDisplayDate(repository.updated_at)}</h4>
    </header>
  )
}

export default Header