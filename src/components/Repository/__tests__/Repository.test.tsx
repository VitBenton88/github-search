import { getRepository } from '@/api'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi, type Mock } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Repository from '../index'
import userEvent from '@testing-library/user-event'
import { mockRepo } from '@/test/__mocks__/repositories.js'

const mockNavigate = vi.fn()

vi.mock('@/api', async () => {
  const actual = await vi.importActual('@/api');
  return {
    ...actual,
    getRepository: vi.fn(),
  }
})

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({
      name: mockRepo.name,
      owner: mockRepo.owner
    })
  };
})

describe('Repository', () => {
  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={['/repo/mock-owner/mock-repo']}>
        <Repository />
      </MemoryRouter>
    );

  const elements = {
    get backBtn() { return screen.getByTestId('back-btn'); },
    get description() { return screen.queryByTestId('description'); },
    get downloads() { return screen.queryByTestId('downloads'); },
    get nav() { return screen.queryByTestId('nav'); },
    get notFoundWarning() { return screen.queryByTestId('not-found'); },
    get ownerLink() { return screen.queryByTestId('owner-link'); },
    get title() { return screen.queryByTestId('title'); },
  };

  describe('render', () => {
    describe('default', () => {
      beforeEach(async () => {
        (getRepository as Mock).mockResolvedValue(mockRepo);

        await waitFor(() => {
          renderComponent();
        })
      })

      it('should render navigation', () => {
        expect(elements.nav).toBeInTheDocument()
      })

      it('should render correct repository data', () => {
        const { description, downloads, notFoundWarning, ownerLink, title } = elements;

        expect(notFoundWarning).not.toBeInTheDocument()
        expect(description).toBeInTheDocument()
        expect(description).toHaveTextContent(mockRepo.description)
        expect(downloads).toHaveTextContent('Has downloads')
        expect(ownerLink).toHaveAttribute('href', mockRepo.owner_url)
        expect(title).toHaveTextContent(mockRepo.name)
      })

      it('should fetch repository on render', () => {
        expect(getRepository).toHaveBeenCalledWith(mockRepo.owner, mockRepo.name)
      })
    });

    describe('when no repository is found', () => {
      beforeEach(async () => {
        (getRepository as Mock).mockResolvedValue(null);

        await waitFor(() => {
          renderComponent();
        })
      })

      it('should only render warning', () => {
        const { notFoundWarning, title } = elements;

        expect(notFoundWarning).toBeInTheDocument()
        expect(title).not.toBeInTheDocument()
      })
    })
  });

  describe('behavior', () => {
    describe('when clicking back button', () => {
      beforeEach(async () => {
        (getRepository as Mock).mockResolvedValue(mockRepo);

        await waitFor(async () => {
          renderComponent();
          await userEvent.click(elements.backBtn);
        })
      })

      it('should navigate user to home route', () => {
        expect(mockNavigate).toHaveBeenCalledWith('/')
      })
    });
  });
})