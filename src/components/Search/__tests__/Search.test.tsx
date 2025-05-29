import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import { SearchContext, type SearchContextType } from '@/context/SearchContext'
import Search from '../index'
import { MemoryRouter } from 'react-router-dom'
import { mockBasicRepos } from '@/test/__mocks__/repositories.js'

const mockContext: SearchContextType = {
  handleSearch: vi.fn(),
  hasSearched: false,
  isLoading: false,
  searchTerm: '',
  repositories: mockBasicRepos
}

describe('Search', () => {
  const renderComponent = (contextValue: SearchContextType = mockContext) => render(
    <SearchContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={['/']}>
        <Search />
      </MemoryRouter>
    </SearchContext.Provider>
  );

  const elements = {
    get loader() { return screen.queryByTestId('loader'); },
    get noSearch() { return screen.queryByTestId('noSearch'); },
    get pageNotFound() { return screen.queryByTestId('pageNotFound'); },
    get searchForm() { return screen.getByTestId('searchForm'); },
    get searchResults() { return screen.queryByTestId('searchResults'); },
  };

  describe('render', () => {
    describe('default', () => {
      beforeEach(async () => {
        await waitFor(() => {
          renderComponent();
        })
      })

      it('should render a search form', () => {
        expect(elements.searchForm).toBeInTheDocument()
      })

      it('should render a search prompt', () => {
        expect(elements.noSearch).toBeInTheDocument()
      })

      it('should not render results', () => {
        expect(elements.searchResults).not.toBeInTheDocument()
      })

      it('should not render a loader', () => {
        expect(elements.loader).not.toBeInTheDocument()
      })

      it('should not render page not found message', () => {
        expect(elements.pageNotFound).not.toBeInTheDocument()
      })
    })

    describe('with a search', () => {
      beforeEach(async () => {
        await waitFor(() => {
          renderComponent({ ...mockContext, hasSearched: true });
        })
      })

      it('should not render a search prompt', () => {
        expect(elements.noSearch).not.toBeInTheDocument()
      })

      it('should render results', () => {
        expect(elements.searchResults).toBeInTheDocument()
      })

      it('should not render a loader', () => {
        expect(elements.loader).not.toBeInTheDocument()
      })
    })

    describe('with a search and loading', () => {
      beforeEach(() => {
        renderComponent({ ...mockContext, hasSearched: true, isLoading: true });
      })

      it('should not render a search prompt', () => {
        expect(elements.noSearch).not.toBeInTheDocument()
      })

      it('should not render results', () => {
        expect(elements.searchResults).not.toBeInTheDocument()
      })

      it('should render a loader', () => {
        expect(elements.loader).toBeInTheDocument()
      })
    })
  })
})