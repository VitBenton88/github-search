import { getRepository } from '@/api'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi, type Mock } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Repository from '../index'
import { mockRepo } from '@/test/__mocks__/repositories.js'

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
    get details() { return screen.queryByTestId('details'); },
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

      it('should render repository details', () => {
        expect(elements.details).toBeInTheDocument()
      })

      it('should not render no repository warning', () => {
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
        const { details, header, notFoundWarning } = elements;

        expect(notFoundWarning).toBeInTheDocument()
        expect(details).not.toBeInTheDocument()
        expect(header).not.toBeInTheDocument()
      })
    })
  })
})