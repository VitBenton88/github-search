import { type FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './index.css'
import { getRepository } from '@/api'
import type { RepositoryType } from '@/types/repository'
import Loader from '@/components/Loader'
import Nav from '@/components/Nav'
import Details from './Details'
import Access from './Access'
import Header from './Header'
import Links from './Links'

const Repository: FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [repository, setRepository] = useState<RepositoryType | null>(null)
  const { name, owner } = useParams<{ owner: string, name: string }>()

  useEffect(() => {
    const fetchRepository = async (owner: string, name: string): Promise<void> => {
      try {
        const fetchedRepository = await getRepository(owner, name)
        setRepository(fetchedRepository)
      } catch (error) {
        console.error(error)
        if (error instanceof Error) {
          alert(error.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    (owner && name) && fetchRepository(owner, name)
  }, [owner, name])

  if (isLoading) return (<Loader />)

  return (
    <>
      <Nav data-testid="nav" />
      {!repository?.id ?
        (<p data-testid="not-found">Repository not found.</p>)
        : (
          <main id="repository">
            <Header repository={repository} data-testid="header" />

            <aside>
              <Details repository={repository} data-testid="details" />
              <Access repository={repository} data-testid="access" />
              <Links repository={repository} data-testid="links" />
            </aside>
          </main>
        )}
    </>
  )
}

export default Repository