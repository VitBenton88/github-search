import { render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { mockRepo } from '@mocks/repositories'
import Access, { type AccessProps } from '../Access'
import { REPO_LABELS } from '../Repository.constants'

const { ARCHIVED, NOT_ARCHIVED, PRIVATE, PUBLIC } = REPO_LABELS

const mockDefaultProps: AccessProps = { repository: mockRepo }

describe('Repository Access details', () => {
  const renderComponent = (propData: AccessProps = mockDefaultProps): RenderResult =>
    render(<Access {...propData} />)

  const elements = {
    get archivedStatus() { return screen.getByTestId('archived-status') },
    get heading() { return screen.getByTestId('heading') },
    get privateStatus() { return screen.getByTestId('private-status') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(async () => {
        await waitFor(() => {
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
      beforeEach(async () => {
        await waitFor(() => {
          const mockProps: AccessProps = {
            repository: { ...mockRepo, archived: true }
          }
          renderComponent(mockProps)
        })
      })

      it('should render correct archived status', () => {
        expect(elements.archivedStatus).toHaveTextContent(ARCHIVED)
      })
    })

    describe('when repository is private', () => {
      beforeEach(async () => {
        await waitFor(() => {
          const mockProps: AccessProps = {
            repository: { ...mockRepo, isPrivate: true }
          }
          renderComponent(mockProps)
        })
      })

      it('should render correct access status', () => {
        expect(elements.privateStatus).toHaveTextContent(PRIVATE)
      })
    })
  })
})