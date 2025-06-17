import { MockSearchConsumer } from '@mocks/consumers'
import { mockRepo } from '@mocks/repositories'
import { act, render, type RenderResult, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import type { RepositoryType } from '@/pages/Repository/types'
import { searchRepositories } from '@/api'
import { SearchProvider } from '@/context/search'

const mockRepos: RepositoryType[] = [mockRepo]
const mockNotify = vi.fn()

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
    get repositories() { return screen.getByTestId('repositories') },
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
          hasSearched, isLoading, repositories, searchBtn, searchTerm
        } = elements

        expect(hasSearched).toHaveTextContent('has not searched')
        expect(isLoading).toHaveTextContent('is not loading')
        expect(repositories).toHaveTextContent('0')
        expect(searchBtn).toBeInTheDocument()
        expect(searchTerm).toHaveTextContent('')
      })
    })
  })

  describe('behavior', () => {
    describe('when searching', () => {
      beforeEach(() => {
        (searchRepositories as Mock).mockResolvedValue(mockRepos)

        renderContext()

        act(() => {
          elements.searchBtn.click()
        })
      })

      it('should call search method with correct term and filter', () => {
        expect(searchRepositories).toHaveBeenCalledWith('mock search term', false)
      })
    })

    describe('when fetch error is thrown', () => {
      beforeEach(() => {
        (searchRepositories as Mock).mockRejectedValue(new Error('Mock Rejection'))

        renderContext()

        act(() => {
          elements.searchBtn.click()
        })
      })

      it('should call notify hook as error', () => {
        expect(mockNotify).toHaveBeenCalledWith('Mock Rejection', 'error')
      })
    })
  })
})