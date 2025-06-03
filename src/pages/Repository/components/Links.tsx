import { type FC, type HTMLAttributes } from 'react'
import Link from '@/components/Link'
import type { RepositoryType } from '@/types/repository'

export type LinksProps = {
  repository: RepositoryType
} & HTMLAttributes<HTMLDivElement>

const Links: FC<LinksProps> = ({ repository, ...props }) => {

  return (
    <section {...props}>
      <header data-testid="heading">
        <h4>Links:</h4>
      </header>

      <ul>
        {repository.homepage?.trim() &&
          (<li>
            <Link href={repository.homepage} data-testid="homepageLink">Homepage &rarr;</Link>
          </li>)
        }
        <li>
          <Link href={repository.html_url} data-testid="githubLink">GitHub &rarr;</Link>
        </li>
      </ul>
    </section>
  )
}

export default Links