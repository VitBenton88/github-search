import { type FC } from 'react'
import type { RepositoryType } from '@/types/repository'

export type AccessProps = {
  repository: RepositoryType
}

const Access: FC<AccessProps> = ({ repository, ...props }) => {

  return (
    <section {...props}>
      <header data-testid="heading">
        <h4>Access:</h4>
      </header>
      <ul>
        <li data-testid="archived-status">{repository.archived ? 'Archived' : 'Not archived'}</li>
        <li data-testid="private-status">{repository.isPrivate ? 'Private' : 'Public'}</li>
      </ul>
    </section>
  )
}

export default Access