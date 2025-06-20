import { render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import Nav from '../Nav'

const mockNavigate: Mock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Nav', () => {
  const renderComponent = (initialEntries: string[] = ['/repo/mock-owner/mock-repo']): RenderResult =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Nav />
      </MemoryRouter>
    )

  const elements = {
    get backBtn() { return screen.getByTestId('back-btn') },
    get nav() { return screen.getByTestId('nav') },
  }

  describe('render', () => {
    beforeEach(() => {
      renderComponent()
    })

    it('should render a nav element', () => {
      expect(elements.nav).toBeInTheDocument()
    })
  })

  describe('behavior', () => {
    describe('when clicking back button', () => {
      beforeEach(async () => {
        await waitFor(() => {
          renderComponent()
          elements.backBtn.click()
        })
      })

      it('should navigate user to home route', () => {
        expect(mockNavigate).toHaveBeenCalledWith('/')
      })
    })
  })
})