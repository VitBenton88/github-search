import { mockRepository } from '@mocks/repositories'
import { render, type RenderResult, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RepositoryContextType } from '@/context/repository/types'
import { NotificationContext } from '@/context/notification'
import { RepositoryContext } from '@/context/repository'
import Repository from '@/pages/Repository'
import { mockRepositoryContext } from '@/test/__mocks__/contexts'

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
    <NotificationContext.Provider value={{ notify: vi.fn(), notification: null }}>
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
})