import { type FC } from 'react'
import type { RepositoryType } from '@/types/repository'

export type DetailsProps = {
  repository: RepositoryType
}

const Details: FC<DetailsProps> = ({ repository, ...props }) => {

  return (
    <section {...props}>
      <header>
        <h4>Details:</h4>
      </header>
      <ul>
        <li data-testid="language">Language: {repository.language}</li>
        <li data-testid="size">Size: {repository.size} bytes</li>
        <li data-testid="downloads">{repository.has_downloads ? 'Has downloads' : 'No downloads'}</li>
        <li data-testid="forking">{repository.allow_forking ? 'Allows forking' : 'Does not allow forking'}</li>
      </ul>
    </section>
  )
}

export default Details