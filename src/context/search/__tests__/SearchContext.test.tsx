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
    beforeEach(() => {
      mockNotify.mockClear()
    })

    describe('when searching', () => {
      beforeEach(async () => {
        (searchRepositories as Mock).mockResolvedValue(mockRepos)

        renderContext()
        act(() => {
          elements.searchBtn.click()
        })

        await waitFor(() => {
          expect(elements.isLoading).toHaveTextContent('is not loading')
        })
      })

      it('should call search method with correct term and filter', () => {
        expect(searchRepositories).toHaveBeenCalledWith('mock search term', false, expect.any(AbortSignal))
      })

      it('should store the results and search state', () => {
        const { hasSearched, results, searchTerm } = elements

        expect(hasSearched).toHaveTextContent('has searched')
        expect(results).toHaveTextContent('1')
        expect(searchTerm).toHaveTextContent('mock search term')
      })
    })

    describe('when fetch error is thrown', () => {
      beforeEach(async () => {
        (searchRepositories as Mock).mockRejectedValue(new Error('Mock Rejection'))

        renderContext()
        act(() => {
          elements.searchBtn.click()
        })

        await waitFor(() => {
          expect(elements.isLoading).toHaveTextContent('is not loading')
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
            <div data-testid="is-loading">{context.isLoading ? 'is loading' : 'is not loading'}</div>
            <button data-testid="first-search" onClick={() => { void context.handleSearch('first', false) }}>first</button>
            <button data-testid="second-search" onClick={() => { void context.handleSearch('second', false) }}>second</button>
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
        resolveSecond(secondResults)
        resolveFirst(firstResults)

        await waitFor(() => {
          expect(screen.getByTestId('results')).toHaveTextContent('second-repo')
        })
        expect(screen.getByTestId('results')).not.toHaveTextContent('first-repo')
      })

      it('should abort the older request without surfacing its rejection or clearing the loading state', async () => {
        const secondResults: SearchResultType[] = [{
          id: 2, name: 'second-repo', description: '', owner: 'owner'
        }]
        const signals: AbortSignal[] = []
        const resolvers: ((value: SearchResultType[]) => void)[] = [];

        // Mirror fetch: reject with an AbortError once the request's signal is aborted. Browsers'
        // DOMException is an Error, but jsdom's isn't, so use a plain Error named AbortError.
        (searchRepositories as Mock).mockImplementation((_keyword: string, _filter: boolean, signal: AbortSignal) =>
          new Promise((resolve, reject) => {
            signals.push(signal)
            resolvers.push(resolve)
            signal.addEventListener('abort', () => reject(Object.assign(new Error('The operation was aborted.'), { name: 'AbortError' })))
          })
        )

        renderContext(<RaceConditionConsumer />)

        act(() => {
          screen.getByTestId('first-search').click()
          screen.getByTestId('second-search').click()
        })

        expect(signals[0].aborted).toBe(true)
        expect(signals[1].aborted).toBe(false)

        // Let the aborted request's rejection settle.
        await act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)) })

        expect(mockNotify).not.toHaveBeenCalled()
        expect(screen.getByTestId('is-loading')).toHaveTextContent('is loading')

        act(() => { resolvers[1](secondResults) })

        await waitFor(() => {
          expect(screen.getByTestId('is-loading')).toHaveTextContent('is not loading')
        })
        expect(screen.getByTestId('results')).toHaveTextContent('second-repo')
      })
    })
  })
})
