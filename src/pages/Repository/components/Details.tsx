import { useContext } from 'react'
import { REPO_LABELS } from '../repository.constants'
import { RepositoryContext } from '@/context/RepositoryContext'

const { ALLOWS_FORKING, FORBIDS_FORKING, HAS_DOWNLOADS, NO_DOWNLOADS } = REPO_LABELS

type DetailsProps = React.HTMLAttributes<HTMLDivElement>

const Details: React.FC<DetailsProps> = ({ ...props }) => {
  const { repository } = useContext(RepositoryContext)
  const {
    allow_forking,
    has_downloads,
    language,
    size
  } = repository

  return (
    <section {...props}>
      <header data-testid="heading">
        <h4>Details:</h4>
      </header>

      <ul>
        {language?.trim() && (
          <li data-testid="language">Language: {language}</li>
        )}
        <li data-testid="size">Size: {size} bytes</li>
        <li data-testid="downloads">{has_downloads ? HAS_DOWNLOADS : NO_DOWNLOADS}</li>
        <li data-testid="forking">{allow_forking ? ALLOWS_FORKING : FORBIDS_FORKING}</li>
      </ul>
    </section>
  )
}

export default Details