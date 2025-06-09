import { act, render, type RenderResult, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import NotFound from '@/pages/NotFound'

describe('NotFound', () => {
  const renderComponent = (
    initialEntries: string[] = ['/repo/mock-owner/mock-repo']
  ): RenderResult =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <NotFound />
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

    it('should render heading element.', () => {
      expect(elements.heading).toBeInTheDocument()
    })
  })
})