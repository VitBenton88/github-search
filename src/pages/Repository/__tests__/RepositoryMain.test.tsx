import { mockRepository } from '@mocks/repositories'
import { render, type RenderResult, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import type { RepositoryContextType } from '@/context/repository/types'
import { RepositoryContext } from '@/context/repository'
import { defaultRepositoryContext } from '@/context/repository/repository.constants'
import RepositoryMain from '@/pages/Repository/RepositoryMain'
import { mockRepositoryContext } from '@/test/__mocks__/contexts'

const mockFetchHandler: Mock = vi.fn().mockResolvedValue(mockRepository)
const mockRepoContext = {
  ...mockRepositoryContext,
  handleFetch: mockFetchHandler,
  repository: mockRepository
}

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({
      name: mockRepository.name,
      owner: mockRepository.owner
    })
  }
})

describe('RepositoryMain', () => {
  const renderComponent = (
    contextValue: RepositoryContextType = mockRepoContext,
    initialEntries: string[] = [`/repo/${mockRepository.owner}/${mockRepository.name}`],
  ): RenderResult => render(
    <MemoryRouter initialEntries={initialEntries}>
      <RepositoryContext.Provider value={contextValue}>
        <RepositoryMain />
      </RepositoryContext.Provider>
    </MemoryRouter>
  )

  const elements = {
    get access() { return screen.queryByTestId('access') },
    get details() { return screen.queryByTestId('details') },
    get header() { return screen.queryAllByTestId('header') },
    get loader() { return screen.queryByTestId('loader') },
    get notFound() { return screen.queryByTestId('not-found') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(() => {
        renderComponent()
      })

      it('should render header', () => {
        expect(elements.header[0]).toBeInTheDocument()
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

      it('should not render "not found" message', () => {
        expect(elements.notFound).not.toBeInTheDocument()
      })

      it('should fetch repository on render', () => {
        expect(mockFetchHandler).toHaveBeenCalledWith(mockRepository.owner, mockRepository.name)
      })

      it('should set document.title to the "owner/name" of the loaded repository', () => {
        expect(document.title).toBe(`${mockRepository.owner}/${mockRepository.name} · GitHub Search`)
      })

      it('should expose a correct heading hierarchy for assistive technology', () => {
        const headings = screen.getAllByRole('heading').map((heading) => ({
          level: Number(heading.tagName.replace('H', '')),
          text: heading.textContent
        }))

        expect(headings).toEqual([
          { level: 1, text: mockRepository.name },
          { level: 2, text: 'Details' },
          { level: 2, text: 'Access' },
          { level: 2, text: 'Links' }
        ])
      })
    })

    describe('with no repository present', () => {
      beforeEach(() => {
        const contextValue = {
          ...mockRepositoryContext,
          repository: { ...mockRepository, id: 0 }
        }
        renderComponent(contextValue)
      })

      it('should only render "none found" message', () => {
        const { access, details, header, loader, notFound } = elements

        expect(notFound).toBeInTheDocument()
        expect(loader).not.toBeInTheDocument()
        expect(access).not.toBeInTheDocument()
        expect(details).not.toBeInTheDocument()
        expect(header[0]).toBeUndefined()
      })

      it('should set document.title to reflect the repository was not found', () => {
        expect(document.title).toBe('Repository not found · GitHub Search')
      })
    })

    describe('when loading', () => {
      beforeEach(() => {
        const contextValue = {
          ...mockRepositoryContext,
          isLoading: true
        }
        renderComponent(contextValue)
      })

      it('should only render loader component', () => {
        const { access, details, header, loader, notFound } = elements

        expect(loader).toBeInTheDocument()
        expect(access).not.toBeInTheDocument()
        expect(details).not.toBeInTheDocument()
        expect(header[0]).toBeUndefined()
        expect(notFound).not.toBeInTheDocument()
      })

      it('should still render within the <main> landmark so route-change focus management can find it', () => {
        const main = screen.getByRole('main')

        expect(main).toContainElement(elements.loader)
      })

      it('should set document.title to reflect the loading state', () => {
        expect(document.title).toBe('Loading… · GitHub Search')
      })
    })

    describe('in the default (idle, not-yet-fetched) context state', () => {
      beforeEach(() => {
        renderComponent(defaultRepositoryContext)
      })

      it('should render the loader, not "not found", before any fetch has been attempted', () => {
        const { access, details, header, loader, notFound } = elements

        expect(loader).toBeInTheDocument()
        expect(notFound).not.toBeInTheDocument()
        expect(access).not.toBeInTheDocument()
        expect(details).not.toBeInTheDocument()
        expect(header[0]).toBeUndefined()
      })
    })
  })
})