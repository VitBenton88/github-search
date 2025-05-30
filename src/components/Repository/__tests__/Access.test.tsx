import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { mockRepo } from '@mocks/repositories'
import Access, { type AccessProps } from '../Access'

const mockDefaultProps: AccessProps = { repository: mockRepo }

describe('Repository Access details', () => {
  const renderComponent = (propData = mockDefaultProps) =>
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
        expect(elements.archivedStatus).toHaveTextContent('Not archived')
      })

      it('should render correct access status', () => {
        expect(elements.privateStatus).toHaveTextContent('Public')
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
        expect(elements.archivedStatus).toHaveTextContent('Archived')
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
        expect(elements.privateStatus).toHaveTextContent('Private')
      })
    })
  })
})