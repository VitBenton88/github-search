import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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

describe('Repository Header', () => {
  const renderComponent = (propData = mockDefaultProps) =>
    render(
      <MemoryRouter initialEntries={['/repo/mock-owner/mock-repo']}>
        <Header {...propData} />
      </MemoryRouter>
    );

  const elements = {
    get created() { return screen.getByTestId('created'); },
    get description() { return screen.getByTestId('description'); },
    get ownerLink() { return screen.getByTestId('owner-link'); },
    get starCount() { return screen.getByTestId('star-count'); },
    get title() { return screen.getByTestId('title'); },
    get updated() { return screen.getByTestId('updated'); },
  };

  describe('render', () => {
    describe('default', () => {
      beforeEach(async () => {
        await waitFor(() => {
          renderComponent();
        })
      })

      it('should render correct repository data', () => {
        const { created, description, ownerLink, starCount, title, updated } = elements;
        const { description: repoDesc, owner_url, stargazers_count, name } = mockRepo;

        expect(created).toHaveTextContent('Created: 12/31/1979, 7:00:00 PM')
        expect(description).toHaveTextContent(repoDesc)
        expect(ownerLink).toHaveAttribute('href', owner_url)
        expect(starCount).toHaveTextContent(`⭐ ${stargazers_count}`)
        expect(title).toHaveTextContent(name)
        expect(updated).toHaveTextContent('Updated: 12/31/1980, 7:00:00 PM')
      })
    })
  })
})