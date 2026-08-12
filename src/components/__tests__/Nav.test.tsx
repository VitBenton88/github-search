import { render, type RenderResult, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import Nav from '../Nav'

describe('Nav', () => {
  const renderComponent = (initialEntries: string[] = ['/repo/mock-owner/mock-repo']): RenderResult =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Nav />
      </MemoryRouter>
    )

  const elements = {
    get backLink() { return screen.getByTestId('back-link') },
    get nav() { return screen.getByTestId('nav') },
  }

  describe('render', () => {
    beforeEach(() => {
      renderComponent()
    })

    it('should render a nav element', () => {
      expect(elements.nav).toBeInTheDocument()
    })

    it('should render a link back to the search page', () => {
      expect(elements.backLink).toHaveAttribute('href', '/')
      expect(elements.backLink.tagName).toBe('A')
    })
  })
})
