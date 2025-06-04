import { type FC, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './Repository.css'
import Loader from '@/components/Loader'
import Details from './components/Details'
import Access from './components/Access'
import Header from './components/Header'
import Links from './components/Links'
import { RepositoryContext } from '@/context/RepositoryContext'

const Repository: FC = () => {
  const { handleFetch, isLoading, repository } = useContext(RepositoryContext)
  const { name, owner } = useParams<{ owner: string, name: string }>()

  useEffect(() => {
    if (!owner || !name) return

    handleFetch(owner, name)
  }, [owner, name, handleFetch])

  if (isLoading) return (<Loader />)

  return (
    <>
      {!repository?.id ?
        (<p data-testid="not-found">Repository not found.</p>)
        : (
          <main id="repository">
            <Header data-testid="header" />

            <aside>
              <Details data-testid="details" />
              <Access data-testid="access" />
              <Links repository={repository} data-testid="links" />
            </aside>
          </main>
        )}
    </>
  )
}

export default Repository