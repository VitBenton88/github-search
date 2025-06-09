import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './Repository.css'
import { Access, Details, Header, Links } from './components'
import { Loader } from '@/components'
import { RepositoryContext } from '@/context/repository'

const Repository: React.FC = () => {
  const { handleFetch, isLoading, repository } = useContext(RepositoryContext)
  const { name, owner } = useParams<{ owner: string, name: string }>()

  useEffect(() => {
    if (!owner || !name) return

    handleFetch(owner, name)
  }, [owner, name, handleFetch])

  if (isLoading) return (<Loader data-testid="loader" />)

  return (
    <main id="repository">
      {!repository.id ? (
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

export default Repository