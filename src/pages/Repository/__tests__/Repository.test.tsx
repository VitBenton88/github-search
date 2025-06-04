import { act, render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Repository from '../Repository'
import { mockRepo } from '@mocks/repositories'
import { RepositoryContext, type RepositoryContextType } from '@/context/RepositoryContext'
import { mockRepositoryContext } from '@/test/__mocks__/contexts'

const mockFetchHandler = vi.fn().mockResolvedValue(mockRepo)
const mockRepoContext = {
  ...mockRepositoryContext,
  handleFetch: mockFetchHandler
}

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({
      name: mockRepo.name,
      owner: mockRepo.owner
    })
  }
})

describe('Repository', () => {
  const renderComponent = (
    contextValue: RepositoryContextType = mockRepoContext,
    initialEntries: string[] = ['/repo/mock-owner/mock-repo'],
  ): RenderResult => render(
    <MemoryRouter initialEntries={initialEntries}>
      <RepositoryContext.Provider value={contextValue}>
        <Repository />
      </RepositoryContext.Provider>
    </MemoryRouter>
  )

  const elements = {
    get access() { return screen.queryByTestId('access') },
    get details() { return screen.queryByTestId('details') },
    get header() { return screen.queryByTestId('header') },
    get notFoundWarning() { return screen.queryByTestId('not-found') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(() => {
        act(() => {
          renderComponent()
        })
      })

      it('should render header', () => {
        expect(elements.header).toBeInTheDocument()
      })

      it('should render repository access details', () => {
        expect(elements.access).toBeInTheDocument()
      })

      it('should render repository details', () => {
        expect(elements.details).toBeInTheDocument()
      })

      it('should not render "no repository" warning', () => {
        expect(elements.notFoundWarning).not.toBeInTheDocument()
      })

      it('should fetch repository on render', () => {
        expect(mockFetchHandler).toHaveBeenCalledWith(mockRepo.owner, mockRepo.name)
      })
    })

    describe('when no repository is found', () => {
      beforeEach(() => {
        act(() => {
          const mockNullFetchHandler = vi.fn().mockResolvedValue(null)
          const contextValue = {
            ...mockRepositoryContext,
            handleFetch: mockNullFetchHandler
          }
          renderComponent(contextValue)
        })
      })

      it('should only render warning', () => {
        waitFor(async () => {
          const { access, details, header, notFoundWarning } = elements

          expect(notFoundWarning).toBeInTheDocument()
          expect(access).not.toBeInTheDocument()
          expect(details).not.toBeInTheDocument()
          expect(header).not.toBeInTheDocument()
        })
      })
    })
  })
})