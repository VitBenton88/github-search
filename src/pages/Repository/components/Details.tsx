import { type FC, type HTMLAttributes } from 'react'
import type { RepositoryType } from '@/types/repository'
import { REPO_LABELS } from '../repository.constants'

const { ALLOWS_FORKING, FORBIDS_FORKING, HAS_DOWNLOADS, NO_DOWNLOADS } = REPO_LABELS

export type DetailsProps = {
  repository: RepositoryType
} & HTMLAttributes<HTMLDivElement>

const Details: FC<DetailsProps> = ({ repository, ...props }) => {

  return (
    <section {...props}>
      <header data-testid="heading">
        <h4>Details:</h4>
      </header>

      <ul>
        {repository.language?.trim() && (
          <li data-testid="language">Language: {repository.language}</li>
        )}
        <li data-testid="size">Size: {repository.size} bytes</li>
        <li data-testid="downloads">{repository.has_downloads ? HAS_DOWNLOADS : NO_DOWNLOADS}</li>
        <li data-testid="forking">{repository.allow_forking ? ALLOWS_FORKING : FORBIDS_FORKING}</li>
      </ul>
    </section>
  )
}

export default Details