import { act, render, type RenderResult, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import NotFoundRedirect from '@/pages/NotFound'

describe('NotFoundRedirect', () => {
  const renderComponent = (initialEntries: string[] = ['/repo/mock-owner/mock-repo']): RenderResult =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <NotFoundRedirect />
      </MemoryRouter>
    )

  const elements = {
    get heading() { return screen.getByTestId('heading') },
    get nav() { return screen.getByTestId('nav') },
  }

  describe('render', () => {
    beforeEach(() => {
      act(() => {
        renderComponent()
      })
    })

    it('should render navigation component.', () => {
      expect(elements.nav).toBeInTheDocument()
    })

    it('should render header element.', () => {
      expect(elements.heading).toBeInTheDocument()
    })
  })
})