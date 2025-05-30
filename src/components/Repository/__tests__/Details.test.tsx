import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { mockRepo } from '@mocks/repositories'
import Details, { type DetailsProps } from '../Details'

const mockDefaultProps: DetailsProps = { repository: mockRepo }

describe('Repository Details', () => {
  const renderComponent = (propData = mockDefaultProps) =>
    render(<Details {...propData} />)

  const elements = {
    get downloads() { return screen.getByTestId('downloads') },
    get forking() { return screen.getByTestId('forking') },
    get heading() { return screen.getByTestId('heading') },
    get language() { return screen.getByTestId('language') },
    get size() { return screen.getByTestId('size') },
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
        const { downloads, forking, language, size } = elements

        expect(downloads).toHaveTextContent('Has downloads')
        expect(forking).toHaveTextContent('Does not allow forking')
        expect(language).toHaveTextContent(mockRepo.language)
        expect(size).toHaveTextContent(`${mockRepo.size} bytes`)
      })
    })

    describe('when repository has no downloads', () => {
      beforeEach(async () => {
        await waitFor(() => {
          const mockProps: DetailsProps = {
            repository: { ...mockRepo, has_downloads: false }
          }
          renderComponent(mockProps)
        })
      })

      it('should render correct downloads status', () => {
        expect(elements.downloads).toHaveTextContent('No downloads')
      })
    })

    describe('when repository allows forking', () => {
      beforeEach(async () => {
        await waitFor(() => {
          const mockProps: DetailsProps = {
            repository: { ...mockRepo, allow_forking: true }
          }
          renderComponent(mockProps)
        })
      })

      it('should render correct forking status', () => {
        expect(elements.forking).toHaveTextContent('Allows forking')
      })
    })
  })
})