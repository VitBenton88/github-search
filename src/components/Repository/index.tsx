import { useEffect, useState, type FC } from 'react'
import { useParams } from 'react-router-dom'
import { getRepository } from '@/api'
import type { RepositoryType } from '@/types/repository'
import Loader from '@/components/Loader'
import ExternalLink from '@/components/ExternalLink'
import Nav from '@/components/Nav'
import Header from './Header'
import Details from './Details'

const Repository: FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [repository, setRepository] = useState<RepositoryType | null>(null)
  const { name, owner } = useParams<{ owner: string, name: string }>()

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const fetchedRepository = await getRepository(owner, name);
        setRepository(fetchedRepository);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          alert(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchRepository();
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

              <section>
                <header>
                  <h4>Access:</h4>
                </header>
                <ul>
                  <li>{repository.archived ? 'Archived' : 'Not archived'}</li>
                  <li>{repository.isPrivate ? 'Private' : 'Public'}</li>
                </ul>
              </section>

              <section>
                <header>
                  <h4>Links:</h4>
                </header>
                <ul>
                  {!!repository.homepage &&
                    (<li>
                      <ExternalLink href={repository.homepage}>Homepage &rarr;</ExternalLink>
                    </li>)
                  }
                  <li>
                    <ExternalLink href={repository.html_url}>GitHub &rarr;</ExternalLink>
                  </li>
                </ul>
              </section>
            </aside>
          </main>
        )}
    </>
  )
}

export default Repository