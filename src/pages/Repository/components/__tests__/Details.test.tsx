import { mockRepo } from '@mocks/repositories'
import { act, render, type RenderResult, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import type { RepositoryContextType } from '@/context/types'
import { RepositoryContext } from '@/context/repository/RepositoryContext'
import { Details } from '@/pages/Repository/components'
import { REPO_LABELS } from '@/pages/Repository/repository.constants'
import { mockRepositoryContext } from '@/test/__mocks__/contexts'

const { ALLOWS_FORKING, FORBIDS_FORKING, HAS_DOWNLOADS, NO_DOWNLOADS } = REPO_LABELS

describe('Repository Details', () => {
  const renderComponent = (
    contextValue: RepositoryContextType = mockRepositoryContext,
  ): RenderResult => render(
    <RepositoryContext.Provider value={contextValue}>
      <Details />
    </RepositoryContext.Provider>
  )

  const elements = {
    get downloads() { return screen.getByTestId('downloads') },
    get forking() { return screen.getByTestId('forking') },
    get heading() { return screen.getByTestId('heading') },
    get language() { return screen.getByTestId('language') },
    get size() { return screen.getByTestId('size') },
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

      it('should render correct downloads status', () => {
        expect(elements.downloads).toHaveTextContent(HAS_DOWNLOADS)
      })

      it('should render correct forking status', () => {
        expect(elements.forking).toHaveTextContent(FORBIDS_FORKING)
      })

      it('should render correct programming language', () => {
        expect(elements.language).toHaveTextContent(mockRepo.language)
      })

      it('should render correct size', () => {
        expect(elements.size).toHaveTextContent(`${mockRepo.size} bytes`)
      })
    })

    describe('when repository has no downloads', () => {
      beforeEach(() => {
        act(() => {
          const mockRepoWithNoDesc = {
            ...mockRepo, has_downloads: false
          }
          const contextValue = {
            ...mockRepositoryContext,
            repository: mockRepoWithNoDesc
          }
          renderComponent(contextValue)
        })
      })

      it('should render correct downloads status', () => {
        expect(elements.downloads).toHaveTextContent(NO_DOWNLOADS)
      })
    })

    describe('when repository allows forking', () => {
      beforeEach(() => {
        act(() => {
          const mockRepoWithNoDesc = {
            ...mockRepo, allow_forking: true
          }
          const contextValue = {
            ...mockRepositoryContext,
            repository: mockRepoWithNoDesc
          }
          renderComponent(contextValue)
        })
      })

      it('should render correct forking status', () => {
        expect(elements.forking).toHaveTextContent(ALLOWS_FORKING)
      })
    })
  })
})