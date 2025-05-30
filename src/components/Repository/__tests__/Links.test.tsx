import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { mockRepo } from '@mocks/repositories'
import Links, { type LinksProps } from '../Links'

const mockDefaultProps: LinksProps = { repository: mockRepo }

describe('Repository Links', () => {
  const renderComponent = (propData = mockDefaultProps) =>
    render(<Links {...propData} />)

  const elements = {
    get githubLink() { return screen.getByTestId('githubLink') },
    get heading() { return screen.getByTestId('heading') },
    get homepageLink() { return screen.queryByTestId('homepageLink') },
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

      it('should render correct repository links', () => {
        const { githubLink, homepageLink } = elements
        const { html_url, homepage } = mockRepo

        expect(githubLink).toHaveAttribute('href', html_url)
        expect(homepageLink).toHaveAttribute('href', homepage)
      })
    })

    describe('when repository has no homepage link', () => {
      beforeEach(async () => {
        await waitFor(() => {
          const mockProps: LinksProps = {
            repository: { ...mockRepo, homepage: '' }
          }
          renderComponent(mockProps)
        })
      })

      it('should not render link for repository’s homepage', () => {
        expect(elements.homepageLink).not.toBeInTheDocument()
      })
    })
  })
})