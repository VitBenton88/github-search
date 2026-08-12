import { MockSearchConsumer } from '@mocks/consumers'
import { mockRepository } from '@mocks/repositories'
import { act, render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { useContext } from 'react'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import type { RepositoryType } from '@/context/repository/types'
import type { SearchResultType } from '@/context/search/types'
import { searchRepositories } from '@/api'
import { SearchContext, SearchProvider } from '@/context/search'

const mockRepos: RepositoryType[] = [mockRepository]
const mockNotify: Mock = vi.fn()

vi.mock('@/api', async () => {
  const actual = await vi.importActual('@/api')
  return {
    ...actual,
    searchRepositories: vi.fn(),
  }
})

vi.mock('@/hooks/useNotification', () => ({
  useNotification: () => mockNotify,
}))

describe('SearchContext', () => {
  const renderContext = (children: React.ReactNode = (<MockSearchConsumer />)): RenderResult => {
    return render(
      <SearchProvider>
        {children}
      </SearchProvider>
    )
  }

  const elements = {
    get hasSearched() { return screen.getByTestId('has-searched') },
    get isLoading() { return screen.getByTestId('is-loading') },
    get results() { return screen.getByTestId('results') },
    get searchBtn() { return screen.getByTestId('search-button') },
    get searchTerm() { return screen.getByTestId('search-term') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(() => {
        renderContext()
      })

      it('should render children', () => {
        const {
          hasSearched, isLoading, results, searchBtn, searchTerm
        } = elements

        expect(hasSearched).toHaveTextContent('has not searched')
        expect(isLoading).toHaveTextContent('is not loading')
        expect(results).toHaveTextContent('0')
        expect(searchBtn).toBeInTheDocument()
        expect(searchTerm).toHaveTextContent('')
      })
    })
  })

  describe('behavior', () => {
    describe('when searching', () => {
      beforeEach(async () => {
        (searchRepositories as Mock).mockResolvedValue(mockRepos)

        await waitFor(() => {
          renderContext()
          elements.searchBtn.click()
        })
      })

      it('should call search method with correct term and filter', () => {
        expect(searchRepositories).toHaveBeenCalledWith('mock search term', false, expect.any(AbortSignal))
      })
    })

    describe('when fetch error is thrown', () => {
      beforeEach(async () => {
        (searchRepositories as Mock).mockRejectedValue(new Error('Mock Rejection'))

        await waitFor(() => {
          renderContext()
          elements.searchBtn.click()
        })
      })

      it('should call notify hook as error', () => {
        expect(mockNotify).toHaveBeenCalledWith('Mock Rejection', 'error')
      })
    })

    describe('when a newer search is submitted before an older one resolves', () => {
      const RaceConditionConsumer = (): React.ReactNode => {
        const context = useContext(SearchContext)

        return (
          <>
            <div data-testid="results">{context.results.map((result) => result.name).join(',')}</div>
            <button data-testid="first-search" onClick={() => context.handleSearch('first', false)}>first</button>
            <button data-testid="second-search" onClick={() => context.handleSearch('second', false)}>second</button>
          </>
        )
      }

      it('should keep the newer search results even if the older request resolves last', async () => {
        const firstResults: SearchResultType[] = [{
          id: 1, name: 'first-repo', description: '', owner: 'owner'
        }]
        const secondResults: SearchResultType[] = [{
          id: 2, name: 'second-repo', description: '', owner: 'owner'
        }]

        let resolveFirst: (value: SearchResultType[]) => void = () => { }
        let resolveSecond: (value: SearchResultType[]) => void = () => { };

        (searchRepositories as Mock)
          .mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve }))
          .mockImplementationOnce(() => new Promise((resolve) => { resolveSecond = resolve }))

        renderContext(<RaceConditionConsumer />)

        act(() => {
          screen.getByTestId('first-search').click()
          screen.getByTestId('second-search').click()
        })

        // Resolve out of order: the newer ("second") request finishes before the stale ("first") one.
        await act(async () => {
          resolveSecond(secondResults)
          resolveFirst(firstResults)
        })

        expect(screen.getByTestId('results')).toHaveTextContent('second-repo')
        expect(screen.getByTestId('results')).not.toHaveTextContent('first-repo')
      })
    })
  })
})