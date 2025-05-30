import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { mockRepo } from '@/test/__mocks__/repositories.js'
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

      it('should render correct repository details', () => {
        const { archivedStatus, privateStatus } = elements

        expect(archivedStatus).toHaveTextContent('Not archived')
        expect(privateStatus).toHaveTextContent('Public')
      })
    })

    describe('with an archived repository', () => {
      beforeEach(async () => {
        await waitFor(() => {
          const mockDefaultProps: AccessProps = {
            repository: { ...mockRepo, archived: true }
          }
          renderComponent(mockDefaultProps)
        })
      })

      it('should render correct archived status', () => {
        expect(elements.archivedStatus).toHaveTextContent('Archived')
      })
    })

    describe('with a private repository', () => {
      beforeEach(async () => {
        await waitFor(() => {
          const mockDefaultProps: AccessProps = {
            repository: { ...mockRepo, isPrivate: true }
          }
          renderComponent(mockDefaultProps)
        })
      })

      it('should render correct private status', () => {
        expect(elements.privateStatus).toHaveTextContent('Private')
      })
    })
  })
})