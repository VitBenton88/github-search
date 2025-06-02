import { render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { mockRepo } from '@mocks/repositories'
import Header, { type HeaderProps } from '../Header'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockDefaultProps: HeaderProps = { repository: mockRepo }

describe('Repository Header', () => {
  const renderComponent = (propData: HeaderProps = mockDefaultProps, initialEntries: string[] = ['/repo/mock-owner/mock-repo']): RenderResult =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Header {...propData} />
      </MemoryRouter>
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

    describe('with no description', () => {
      beforeEach(async () => {
        await waitFor(() => {
          const mockProps: HeaderProps = { repository: { ...mockRepo, description: '' } }
          renderComponent(mockProps)
        })
      })

      it('should not render repository description', () => {
        expect(elements.description).not.toBeInTheDocument()
      })
    })
  })
})