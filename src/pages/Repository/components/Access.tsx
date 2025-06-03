import { type FC, type HTMLAttributes } from 'react'
import type { RepositoryType } from '@/types/repository'
import { REPO_LABELS } from '../Repository.constants'

const { ARCHIVED, NOT_ARCHIVED, PRIVATE, PUBLIC } = REPO_LABELS

export type AccessProps = {
  repository: RepositoryType
} & HTMLAttributes<HTMLDivElement>

const Access: FC<AccessProps> = ({ repository, ...props }) => {

  return (
    <section {...props}>
      <header data-testid="heading">
        <h4>Access:</h4>
      </header>

      <ul>
        <li data-testid="archived-status">{repository.archived ? ARCHIVED : NOT_ARCHIVED}</li>
        <li data-testid="private-status">{repository.isPrivate ? PRIVATE : PUBLIC}</li>
      </ul>
    </section>
  )
}

export default Access