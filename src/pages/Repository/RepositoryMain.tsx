import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './Repository.css'
import { Loader } from '@/components'
import { RepositoryContext } from '@/context/repository'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { Access, Details, Header, Links } from '@/pages/Repository/components'

const RepositoryMain: React.FC = () => {
  const { handleFetch, isLoading, repository } = useContext(RepositoryContext)
  const { name, owner } = useParams<{ owner: string, name: string }>()

  useEffect(() => {
    if (!owner || !name) return

    void handleFetch(owner, name)
  }, [owner, name, handleFetch])

  const pageTitle = isLoading
    ? 'Loading…'
    : repository.id
      ? `${repository.owner}/${repository.name}`
      : 'Repository not found'

  useDocumentTitle(pageTitle)

  return (
    <main id="repository">
      {isLoading ? (
        <Loader data-testid="loader" />
      ) : !repository.id ? (
        <h1 data-testid="not-found">Repository not found.</h1>
      ) : (
        <>
          <Header data-testid="header" />

          <aside>
            <Details data-testid="details" />
            <Access data-testid="access" />
            <Links data-testid="links" />
          </aside>
        </>
      )}
    </main>
  )
}

export default RepositoryMain