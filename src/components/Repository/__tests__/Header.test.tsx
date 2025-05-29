import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { mockRepo } from '@/test/__mocks__/repositories.js'
import Header, { type HeaderProps } from '../Header'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
})

const mockDefaultProps: HeaderProps = { repository: mockRepo };

describe('Header', () => {
  const renderComponent = (propData = mockDefaultProps) =>
    render(
      <MemoryRouter initialEntries={['/repo/mock-owner/mock-repo']}>
        <Header {...propData} />
      </MemoryRouter>
    );

  const elements = {
    get description() { return screen.getByTestId('description'); },
    get ownerLink() { return screen.getByTestId('owner-link'); },
    get title() { return screen.getByTestId('title'); },
  };

  describe('render', () => {
    describe('default', () => {
      beforeEach(async () => {
        await waitFor(() => {
          renderComponent();
        })
      })

      it('should render correct repository data', () => {
        const { description, ownerLink, title } = elements;

        expect(description).toBeInTheDocument()
        expect(description).toHaveTextContent(mockRepo.description)
        expect(ownerLink).toHaveAttribute('href', mockRepo.owner_url)
        expect(title).toHaveTextContent(mockRepo.name)
      })
    })
  })
})