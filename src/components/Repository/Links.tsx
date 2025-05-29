import { type FC } from 'react'
import ExternalLink from '@/components/ExternalLink'
import type { RepositoryType } from '@/types/repository'

export type LinksProps = {
  repository: RepositoryType
}

const Links: FC<LinksProps> = ({ repository, ...props }) => {

  return (
    <section {...props}>
      <header data-testid="heading">
        <h4>Links:</h4>
      </header>
      <ul>
        {!!repository.homepage &&
          (<li>
            <ExternalLink href={repository.homepage} data-testid="homepageLink">Homepage &rarr;</ExternalLink>
          </li>)
        }
        <li>
          <ExternalLink href={repository.html_url} data-testid="githubLink">GitHub &rarr;</ExternalLink>
        </li>
      </ul>
    </section>
  )
}

export default Links