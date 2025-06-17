import { mockRepository } from '@mocks/repositories'
import { render, type RenderResult, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import type { RepositoryContextType } from '@/context/repository/types'
import { RepositoryContext } from '@/context/repository'
import { Access } from '@/pages/Repository/components'
import { REPO_LABELS } from '@/pages/Repository/repository.constants'
import { mockRepositoryContext } from '@/test/__mocks__/contexts'

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
    get header() { return screen.getByTestId('header') },
    get privateStatus() { return screen.getByTestId('private-status') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(() => {
        renderComponent()
      })

      it('should render header', () => {
        expect(elements.header).toBeInTheDocument()
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
        const mockRepoIsArchived = {
          ...mockRepository, archived: true
        }
        const contextValue = {
          ...mockRepositoryContext,
          repository: mockRepoIsArchived
        }
        renderComponent(contextValue)
      })

      it('should render correct archived status', () => {
        expect(elements.archivedStatus).toHaveTextContent(ARCHIVED)
      })
    })

    describe('when repository is private', () => {
      beforeEach(() => {
        const mockRepoIsPrivate = {
          ...mockRepository, isPrivate: true
        }
        const contextValue = {
          ...mockRepositoryContext,
          repository: mockRepoIsPrivate
        }
        renderComponent(contextValue)
      })

      it('should render correct access status', () => {
        expect(elements.privateStatus).toHaveTextContent(PRIVATE)
      })
    })
  })
})