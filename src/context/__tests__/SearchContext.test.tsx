import { searchRepositories } from '@/api'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi, type Mock } from 'vitest'
import { SearchProvider } from '../SearchContext'
import userEvent from '@testing-library/user-event'
import { mockRepo } from '@/test/__mocks__/repositories.js'
import { MockSearchConsumer } from '@/test/__mocks__/consumers.js'
import type { RepositoryType } from '@/types/repository.js'

const mockRepos: RepositoryType[] = [mockRepo];

vi.mock('@/api', async () => {
  const actual = await vi.importActual('@/api');
  return {
    ...actual,
    searchRepositories: vi.fn(),
  }
})

describe('SearchContext', () => {
  const renderContext = (children: React.ReactNode = (<MockSearchConsumer />)) => {
    return render(
      <SearchProvider>
        {children}
      </SearchProvider>
    )
  }

  const elements = {
    get hasSearched() { return screen.getByTestId('hasSearched'); },
    get isLoading() { return screen.getByTestId('isLoading'); },
    get repositories() { return screen.getByTestId('repositories'); },
    get searchBtn() { return screen.getByTestId('search-button'); },
    get searchTerm() { return screen.getByTestId('searchTerm'); },
  };

  describe('render', () => {
    describe('default', () => {
      beforeEach(async () => {
        await waitFor(() => {
          renderContext();
        })
      })

      it('should render children', () => {
        const {
          hasSearched, isLoading, repositories, searchBtn, searchTerm
        } = elements;

        expect(hasSearched).toHaveTextContent('has not searched')
        expect(isLoading).toHaveTextContent('is not loading')
        expect(repositories).toHaveTextContent('0')
        expect(searchBtn).toBeInTheDocument()
        expect(searchTerm).toHaveTextContent('')
      })
    });
  });

  describe('behavior', () => {
    describe('when searching', () => {
      beforeEach(async () => {
        (searchRepositories as Mock).mockResolvedValue(mockRepos);

        await waitFor(async () => {
          renderContext();
          await userEvent.click(elements.searchBtn);
        })
      })

      it('should call search method with correct term and filter', () => {
        expect(searchRepositories).toHaveBeenCalledWith('mock search term', false)
      })
    });
  });
})