import { act, render, type RenderResult, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { RepositoryContext } from '@/context/RepositoryContext'
import { mockRepo } from '@mocks/repositories'
import { Access } from '@/pages/Repository/components'
import { REPO_LABELS } from '@/pages/Repository/repository.constants'
import { mockRepositoryContext } from '@/test/__mocks__/contexts'
import type { RepositoryContextType } from '@/context/types'

const { ARCHIVED, NOT_ARCHIVED, PRIVATE, PUBLIC } = REPO_LABELS

describe('Repository Access details', () => {
  const renderComponent = (
    contextValue: RepositoryContextType = mockRepositoryContext,
  ): RenderResult => render(
    <RepositoryContext.Provider value={contextValue}>
      <Access />
    </RepositoryContext.Provider>
  )

  const elements = {
    get archivedStatus() { return screen.getByTestId('archived-status') },
    get heading() { return screen.getByTestId('heading') },
    get privateStatus() { return screen.getByTestId('private-status') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(() => {
        act(() => {
          renderComponent()
        })
      })

      it('should render header', () => {
        expect(elements.heading).toBeInTheDocument()
      })

      it('should render correct archived status', () => {
        expect(elements.archivedStatus).toHaveTextContent(NOT_ARCHIVED)
      })

      it('should render correct access status', () => {
        expect(elements.privateStatus).toHaveTextContent(PUBLIC)
      })
    })

    describe('when repository is archived', () => {
      beforeEach(() => {
        act(() => {
          const mockRepoWithNoDesc = {
            ...mockRepo, archived: true
          }
          const contextValue = {
            ...mockRepositoryContext,
            repository: mockRepoWithNoDesc
          }
          renderComponent(contextValue)
        })
      })

      it('should render correct archived status', () => {
        expect(elements.archivedStatus).toHaveTextContent(ARCHIVED)
      })
    })

    describe('when repository is private', () => {
      beforeEach(() => {
        act(() => {
          const mockRepoWithNoDesc = {
            ...mockRepo, isPrivate: true
          }
          const contextValue = {
            ...mockRepositoryContext,
            repository: mockRepoWithNoDesc
          }
          renderComponent(contextValue)
        })
      })

      it('should render correct access status', () => {
        expect(elements.privateStatus).toHaveTextContent(PRIVATE)
      })
    })
  })
})