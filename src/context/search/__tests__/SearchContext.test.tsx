import { MockSearchConsumer } from '@mocks/consumers'
import { mockRepository } from '@mocks/repositories'
import { render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import type { RepositoryType } from '@/context/repository/types'
import { searchRepositories } from '@/api'
import { SearchProvider } from '@/context/search'

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
        expect(searchRepositories).toHaveBeenCalledWith('mock search term', false)
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
  })
})