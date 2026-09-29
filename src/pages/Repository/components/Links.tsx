import { useContext } from 'react'
import { Link } from '@/components'
import { RepositoryContext } from '@/context/repository'

/**
 * Normalize a user-supplied repository homepage into a safe external URL. Homepages are
 * free-form, so add https:// when no scheme is given, and allow only http(s) links.
 */
const toSafeHomepageUrl = (homepage: string | null): string | null => {
  const trimmed = homepage?.trim()
  if (!trimmed) return null

  const candidate = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const { protocol } = new URL(candidate)
    return protocol === 'http:' || protocol === 'https:' ? candidate : null
  } catch {
    return null
  }
}

type LinksProps = React.HTMLAttributes<HTMLElement>

const Links: React.FC<LinksProps> = (props) => {
  const { repository } = useContext(RepositoryContext)
  const { homepage, html_url } = repository
  const homepageUrl = toSafeHomepageUrl(homepage)

  return (
    <section {...props}>
      <header data-testid="header">
        <h2>Links</h2>
      </header>

      <ul>
        {homepageUrl && (
          <li>
            <Link href={homepageUrl} data-testid="homepage-link">Homepage &rarr;</Link>
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