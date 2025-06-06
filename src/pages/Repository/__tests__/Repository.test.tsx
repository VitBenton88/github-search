import { mockRepo } from '@mocks/repositories'
import { act, render, type RenderResult, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Repository from '../Repository'
import type { RepositoryContextType } from '@/context/types'
import { RepositoryContext } from '@/context/repository/RepositoryContext'
import { mockRepositoryContext } from '@/test/__mocks__/contexts'

const mockFetchHandler = vi.fn().mockResolvedValue(mockRepo)
const mockRepoContext = {
  ...mockRepositoryContext,
  handleFetch: mockFetchHandler,
  repository: mockRepo
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
    initialEntries: string[] = [`/repo/${mockRepo.owner}/${mockRepo.name}`],
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
    get loader() { return screen.queryByTestId('loader') },
    get notFound() { return screen.queryByTestId('none-found') },
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

      it('should not render loader component', () => {
        expect(elements.loader).not.toBeInTheDocument()
      })

      it('should not render "none found" message', () => {
        expect(elements.notFound).not.toBeInTheDocument()
      })

      it('should fetch repository on render', () => {
        expect(mockFetchHandler).toHaveBeenCalledWith(mockRepo.owner, mockRepo.name)
      })
    })

    describe('with no repository present', () => {
      beforeEach(() => {
        act(() => {
          const contextValue = {
            ...mockRepositoryContext,
            repository: { ...mockRepo, id: '' }
          }
          renderComponent(contextValue)
        })
      })

      it('should only render "none found" message', () => {
        const { access, details, header, loader, notFound } = elements

        expect(notFound).toBeInTheDocument()
        expect(loader).not.toBeInTheDocument()
        expect(access).not.toBeInTheDocument()
        expect(details).not.toBeInTheDocument()
        expect(header).not.toBeInTheDocument()
      })
    })

    describe('when loading', () => {
      beforeEach(() => {
        act(() => {
          const contextValue = {
            ...mockRepositoryContext,
            isLoading: true
          }
          renderComponent(contextValue)
        })
      })

      it('should only render loader component', () => {
        const { access, details, header, loader, notFound } = elements

        expect(loader).toBeInTheDocument()
        expect(access).not.toBeInTheDocument()
        expect(details).not.toBeInTheDocument()
        expect(header).not.toBeInTheDocument()
        expect(notFound).not.toBeInTheDocument()
      })
    })
  })
})