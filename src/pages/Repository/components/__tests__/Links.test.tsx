import { mockRepo } from '@mocks/repositories'
import { act, render, type RenderResult, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import type { RepositoryContextType } from '@/context/types'
import { RepositoryContext } from '@/context/repository/RepositoryContext'
import { Links } from '@/pages/Repository/components'
import { mockRepositoryContext } from '@/test/__mocks__/contexts'

describe('Repository Links', () => {
  const renderComponent = (
    contextValue: RepositoryContextType = mockRepositoryContext,
  ): RenderResult => render(
    <RepositoryContext.Provider value={contextValue}>
      <Links />
    </RepositoryContext.Provider>
  )

  const elements = {
    get githubLink() { return screen.getByTestId('githubLink') },
    get heading() { return screen.getByTestId('heading') },
    get homepageLink() { return screen.queryByTestId('homepageLink') },
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

      it('should render correct homepage link', () => {
        expect(elements.homepageLink).toHaveAttribute('href', mockRepo.homepage)
      })

      it('should render correct github link', () => {
        expect(elements.githubLink).toHaveAttribute('href', mockRepo.html_url)
      })
    })

    describe('when repository has no homepage link', () => {
      beforeEach(() => {
        act(() => {
          const mockRepoWithNoDesc = {
            ...mockRepo, homepage: ''
          }
          const contextValue = {
            ...mockRepositoryContext,
            repository: mockRepoWithNoDesc
          }
          renderComponent(contextValue)
        })
      })

      it('should not render link for repository’s homepage', () => {
        expect(elements.homepageLink).not.toBeInTheDocument()
      })
    })
  })
})