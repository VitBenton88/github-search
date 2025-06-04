import { type FC, type HTMLAttributes, useContext } from 'react'
import { REPO_LABELS } from '../repository.constants'
import { RepositoryContext } from '@/context/RepositoryContext'

const { ARCHIVED, NOT_ARCHIVED, PRIVATE, PUBLIC } = REPO_LABELS

export type AccessProps = HTMLAttributes<HTMLDivElement>

const Access: FC<AccessProps> = ({ ...props }) => {
  const { repository } = useContext(RepositoryContext)
  const {
    archived,
    isPrivate
  } = repository

  return (
    <section {...props}>
      <header data-testid="heading">
        <h4>Access:</h4>
      </header>

      <ul>
        <li data-testid="archived-status">{archived ? ARCHIVED : NOT_ARCHIVED}</li>
        <li data-testid="private-status">{isPrivate ? PRIVATE : PUBLIC}</li>
      </ul>
    </section>
  )
}

export default Access