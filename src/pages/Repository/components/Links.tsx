import { useContext } from 'react'
import { Link } from '@/components'
import { RepositoryContext } from '@/context/repository/RepositoryContext'

type LinksProps = React.HTMLAttributes<HTMLDivElement>

const Links: React.FC<LinksProps> = ({ ...props }) => {
  const { repository } = useContext(RepositoryContext)
  const { homepage, html_url } = repository

  return (
    <section {...props}>
      <header data-testid="heading">
        <h4>Links:</h4>
      </header>

      <ul>
        {homepage?.trim() &&
          (<li>
            <Link href={homepage} data-testid="homepageLink">Homepage &rarr;</Link>
          </li>)
        }
        <li>
          <Link href={html_url} data-testid="githubLink">GitHub &rarr;</Link>
        </li>
      </ul>
    </section>
  )
}

export default Links