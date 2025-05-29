import { getRepository } from '@/api'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi, type Mock } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Repository from '../index'
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
    get downloads() { return screen.queryByTestId('downloads'); },
    get header() { return screen.queryByTestId('header'); },
    get nav() { return screen.queryByTestId('nav'); },
    get notFoundWarning() { return screen.queryByTestId('not-found'); },
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

      it('should render header', () => {
        expect(elements.header).toBeInTheDocument()
      })


      it('should render correct repository data', () => {
        expect(elements.downloads).toHaveTextContent('Has downloads')
      })


      it('should not render no repo warning', () => {
        expect(elements.notFoundWarning).not.toBeInTheDocument()
      })

      it('should fetch repository on render', () => {
        expect(getRepository).toHaveBeenCalledWith(mockRepo.owner, mockRepo.name)
      })
    })

    describe('when no repository is found', () => {
      beforeEach(async () => {
        (getRepository as Mock).mockResolvedValue(null);

        await waitFor(() => {
          renderComponent();
        })
      })

      it('should only render warning', () => {
        const { header, notFoundWarning } = elements;

        expect(notFoundWarning).toBeInTheDocument()
        expect(header).not.toBeInTheDocument()
      })
    })
  })
})