import { mockRepository } from '@mocks/repositories'
import { render, type RenderResult, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import type { RepositoryContextType } from '@/context/repository/types'
import { RepositoryContext } from '@/context/repository'
import { Header } from '@/pages/Repository/components'
import { mockRepositoryContext } from '@/test/__mocks__/contexts'

const mockNavigate: Mock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Repository Header', () => {
  const renderComponent = (
    contextValue: RepositoryContextType = mockRepositoryContext,
  ): RenderResult => render(
    <RepositoryContext.Provider value={contextValue}>
      <Header />
    </RepositoryContext.Provider>
  )

  const elements = {
    get created() { return screen.getByTestId('created') },
    get description() { return screen.queryByTestId('description') },
    get ownerLink() { return screen.getByTestId('owner-link') },
    get starCount() { return screen.getByTestId('star-count') },
    get title() { return screen.getByTestId('title') },
    get updated() { return screen.getByTestId('updated') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(() => {
        renderComponent()
      })

      it('should render correct created date', () => {
        expect(elements.created).toHaveTextContent('Created: 1/26/2011, 2:01:12 PM')
      })

      it('should render correct repository description', () => {
        expect(elements.description).toHaveTextContent(mockRepository.description)
      })

      it('should render correct repository owner link', () => {
        expect(elements.ownerLink).toHaveAttribute('href', mockRepository.owner_url)
      })

      it('should render correct repository star count', () => {
        expect(elements.starCount).toHaveTextContent(`⭐ ${mockRepository.stargazers_count}`)
      })

      it('should render correct page title', () => {
        expect(elements.title).toHaveTextContent(mockRepository.name)
      })

      it('should render correct updated date', () => {
        expect(elements.updated).toHaveTextContent('Updated: 1/26/2011, 2:14:43 PM')
      })
    })

    describe('when repository has no description', () => {
      beforeEach(() => {
        const mockRepoWithNoDesc = {
          ...mockRepository, description: ''
        }
        const contextValue = {
          ...mockRepositoryContext,
          repository: mockRepoWithNoDesc
        }
        renderComponent(contextValue)
      })

      it('should not render repository description', () => {
        expect(elements.description).not.toBeInTheDocument()
      })
    })
  })
})