import { mockSearchContext } from '@mocks/contexts'
import { render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import type { SearchContextType } from '@/context/search/types'
import { SearchContext } from '@/context/search'
import Search from '@/pages/Search'

describe('Search', () => {
  const renderComponent = (
    contextValue: SearchContextType = mockSearchContext,
    initialEntries: string[] = ['/']
  ): RenderResult => render(
    <SearchContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={initialEntries}>
        <Search />
      </MemoryRouter>
    </SearchContext.Provider>
  )

  const elements = {
    get loader() { return screen.queryByTestId('loader') },
    get noSearch() { return screen.queryByTestId('no-search') },
    get searchForm() { return screen.getByTestId('search-form') },
    get searchResults() { return screen.queryByTestId('search-results') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(async () => {
        await waitFor(() => {
          renderComponent()
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
    })

    describe('with a search', () => {
      beforeEach(async () => {
        await waitFor(() => {
          renderComponent({ ...mockSearchContext, hasSearched: true })
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
        renderComponent({ ...mockSearchContext, hasSearched: true, isLoading: true })
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