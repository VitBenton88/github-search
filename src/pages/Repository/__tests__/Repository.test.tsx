import { mockRepository } from '@mocks/repositories'
import { act, render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import type { RepositoryContextType } from '@/context/repository/types'
import { getRepository } from '@/api'
import { NotificationContext } from '@/context/notification'
import { RepositoryContext } from '@/context/repository'
import Repository from '@/pages/Repository'
import { mockRepositoryContext } from '@/test/__mocks__/contexts'

vi.mock('@/api', async () => {
  const actual = await vi.importActual('@/api')
  return {
    ...actual,
    getRepository: vi.fn(),
  }
})

const mockRepoContext = {
  ...mockRepositoryContext,
  handleFetch: vi.fn(),
  repository: mockRepository
}

describe('Repository', () => {
  const renderComponent = (
    contextValue: RepositoryContextType = mockRepoContext,
    initialEntries: string[] = [`/repo/${mockRepository.owner}/${mockRepository.name}`],
  ): RenderResult => render(
    <NotificationContext.Provider value={{ notify: vi.fn() }}>
      <MemoryRouter initialEntries={initialEntries}>
        <RepositoryContext.Provider value={contextValue}>
          <Repository />
        </RepositoryContext.Provider>
      </MemoryRouter>
    </NotificationContext.Provider>
  )

  const elements = {
    get nav() { return screen.getByTestId('nav') },
  }

  beforeEach(() => {
    (getRepository as Mock).mockReset().mockResolvedValue(mockRepository)
  })

  describe('render', () => {
    describe('default', () => {
      beforeEach(() => {
        renderComponent()
      })

      it('should render a navigation component', () => {
        expect(elements.nav).toBeInTheDocument()
      })
    })
  })

  describe('behavior', () => {
    describe('when the route changes to a repository that fails to load', () => {
      const NavigateButton = (): React.ReactNode => {
        const navigate = useNavigate()

        return <button data-testid="go-second" onClick={() => { void navigate('/repo/owner/second') }}>second</button>
      }

      it('should not keep showing the previous repository', async () => {
        (getRepository as Mock)
          .mockResolvedValueOnce({ ...mockRepository, id: 1, name: 'first-repo' })
          .mockRejectedValueOnce(new Error('Not Found'))

        render(
          <NotificationContext.Provider value={{ notify: vi.fn() }}>
            <MemoryRouter initialEntries={['/repo/owner/first']}>
              <Routes>
                <Route path="/repo/:owner/:name" element={<Repository />} />
              </Routes>
              <NavigateButton />
            </MemoryRouter>
          </NotificationContext.Provider>
        )

        await waitFor(() => {
          expect(screen.getByTestId('title')).toHaveTextContent('first-repo')
        })

        act(() => {
          screen.getByTestId('go-second').click()
        })

        await waitFor(() => {
          expect(screen.getByTestId('error')).toHaveTextContent('Not Found')
        })
        expect(screen.queryByText('first-repo')).not.toBeInTheDocument()
      })
    })
  })
})
