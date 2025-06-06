import { mockRepo } from '@mocks/repositories'
import { act, render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RepositoryContextType } from '@/context/types'
import { RepositoryContext } from '@/context/repository/RepositoryContext'
import { Header } from '@/pages/Repository/components'
import { mockRepositoryContext } from '@/test/__mocks__/contexts'

const mockNavigate = vi.fn()

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
      beforeEach(async () => {
        await waitFor(() => {
          renderComponent()
        })
      })

      it('should render correct created date', () => {
        expect(elements.created).toHaveTextContent(`Created: 12/31/1979, 7:00:00 PM`)
      })

      it('should render correct repository description', () => {
        expect(elements.description).toHaveTextContent(mockRepo.description)
      })

      it('should render correct repository owner link', () => {
        expect(elements.ownerLink).toHaveAttribute('href', mockRepo.owner_url)
      })

      it('should render correct repository star count', () => {
        expect(elements.starCount).toHaveTextContent(`⭐ ${mockRepo.stargazers_count}`)
      })

      it('should render correct page title', () => {
        expect(elements.title).toHaveTextContent(mockRepo.name)
      })

      it('should render correct updated date', () => {
        expect(elements.updated).toHaveTextContent('Updated: 12/31/1980, 7:00:00 PM')
      })
    })

    describe('when repository has no description', () => {
      beforeEach(() => {
        act(() => {
          const mockRepoWithNoDesc = {
            ...mockRepo, description: ''
          }
          const contextValue = {
            ...mockRepositoryContext,
            repository: mockRepoWithNoDesc
          }
          renderComponent(contextValue)
        })
      })

      it('should not render repository description', () => {
        expect(elements.description).not.toBeInTheDocument()
      })
    })
  })
})