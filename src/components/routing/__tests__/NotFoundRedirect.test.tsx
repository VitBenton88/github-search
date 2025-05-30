import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import NotFoundRedirect from '../NotFoundRedirect'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('NotFoundRedirect', () => {
  const renderComponent = () => render(<NotFoundRedirect />)

  describe('render', () => {
    beforeEach(async () => {
      await waitFor(() => {
        renderComponent()
      })
    })

    it('should navigate user to home route with error message.', () => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { state: { error: 'Page not found' }, replace: true })
    })
  })
})