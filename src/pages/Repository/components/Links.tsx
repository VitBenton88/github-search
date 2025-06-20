import { useContext } from 'react'
import { Link } from '@/components'
import { RepositoryContext } from '@/context/repository'

type LinksProps = React.HTMLAttributes<HTMLDivElement>

const Links: React.FC<LinksProps> = ({ ...props }) => {
  const { repository } = useContext(RepositoryContext)
  const { homepage, html_url } = repository

  return (
    <section {...props}>
      <header data-testid="header">
        <h4>Links:</h4>
      </header>

      <ul>
        {homepage?.trim() && (
          <li>
            <Link href={homepage} data-testid="homepage-link">Homepage &rarr;</Link>
          </li>
        )}
        <li>
          <Link href={html_url} data-testid="github-link">GitHub &rarr;</Link>
        </li>
      </ul>
    </section>
  )
}

export default Links