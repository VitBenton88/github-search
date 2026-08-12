import { useEffect } from 'react'

const SITE_TITLE = 'GitHub Search'

/**
 * Sets document.title for the current page, so screen-reader and
 * browser-tab/history users can tell which page/repo they're on.
 * @param pageTitle - Optional page-specific title to prefix the site title with.
 */
export const useDocumentTitle = (pageTitle?: string): void => {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} · ${SITE_TITLE}` : SITE_TITLE
  }, [pageTitle])
}
