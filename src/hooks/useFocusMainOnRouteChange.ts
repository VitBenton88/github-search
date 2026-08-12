import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Moves keyboard/screen-reader focus to the current page's <main> landmark
 * whenever the route changes, so assistive technology users are told the
 * page has changed instead of focus silently reverting to <body>.
 */
export const useFocusMainOnRouteChange = (): void => {
  const { pathname } = useLocation()

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    const hadTabIndex = main.hasAttribute('tabindex')
    if (!hadTabIndex) main.setAttribute('tabindex', '-1')

    main.focus()

    if (!hadTabIndex) main.removeAttribute('tabindex')
  }, [pathname])
}
