import { MockRepositoryConsumer } from '@mocks/consumers'
import { mockRepository } from '@mocks/repositories'
import { act, render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { useContext } from 'react'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import type { RepositoryType } from '@/context/repository/types'
import { getRepository } from '@/api'
import { RepositoryContext, RepositoryProvider } from '@/context/repository'

const mockNotify: Mock = vi.fn()

vi.mock('@/api', async () => {
  const actual = await vi.importActual('@/api')
  return {
    ...actual,
    getRepository: vi.fn(),
  }
})

vi.mock('@/hooks/useNotification', () => ({
  useNotification: () => mockNotify,
}))

describe('RepositoryContext', () => {
  const renderContext = (children: React.ReactNode = (<MockRepositoryConsumer />)): RenderResult => {
    return render(
      <RepositoryProvider>
        {children}
      </RepositoryProvider>
    )
  }

  const elements = {
    get fetchBtn() { return screen.getByTestId('fetch-button') },
    get isLoading() { return screen.getByTestId('is-loading') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(() => {
        renderContext()
      })

      it('should render children', () => {
        const { fetchBtn, isLoading } = elements

        expect(fetchBtn).toBeInTheDocument()
        expect(isLoading).toHaveTextContent('is loading')
      })
    })
  })

  describe('behavior', () => {
    describe('when searching', () => {
      beforeEach(async () => {
        (getRepository as Mock).mockResolvedValue(mockRepository)

        await waitFor(() => {
          renderContext()
          elements.fetchBtn.click()
        })
      })

      it('should call fetch method with correct repo owner and name', () => {
        expect(getRepository).toHaveBeenCalledWith('mock owner', 'mock name', expect.any(AbortSignal))
      })
    })

    describe('when fetch error is thrown', () => {
      beforeEach(async () => {
        (getRepository as Mock).mockRejectedValue(new Error('Mock Rejection'))

        await waitFor(() => {
          renderContext()
          elements.fetchBtn.click()
        })
      })

      it('should call notify hook as error', () => {
        expect(mockNotify).toHaveBeenCalledWith('Mock Rejection', 'error')
      })
    })

    describe('when a newer fetch is submitted before an older one resolves', () => {
      const RaceConditionConsumer = (): React.ReactNode => {
        const context = useContext(RepositoryContext)

        return (
          <>
            <div data-testid="repo-name">{context.repository.name}</div>
            <button data-testid="fetch-first" onClick={() => context.handleFetch('owner', 'first')}>first</button>
            <button data-testid="fetch-second" onClick={() => context.handleFetch('owner', 'second')}>second</button>
          </>
        )
      }

      it('should keep the newer repository even if the older request resolves last', async () => {
        const firstRepo: RepositoryType = { ...mockRepository, id: 1, name: 'first-repo' }
        const secondRepo: RepositoryType = { ...mockRepository, id: 2, name: 'second-repo' }

        let resolveFirst: (value: RepositoryType) => void = () => { }
        let resolveSecond: (value: RepositoryType) => void = () => { };

        (getRepository as Mock)
          .mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve }))
          .mockImplementationOnce(() => new Promise((resolve) => { resolveSecond = resolve }))

        renderContext(<RaceConditionConsumer />)

        act(() => {
          screen.getByTestId('fetch-first').click()
          screen.getByTestId('fetch-second').click()
        })

        // Resolve out of order: the newer ("second") request finishes before the stale ("first") one.
        await act(async () => {
          resolveSecond(secondRepo)
          resolveFirst(firstRepo)
        })

        expect(screen.getByTestId('repo-name')).toHaveTextContent('second-repo')
        expect(screen.getByTestId('repo-name')).not.toHaveTextContent('first-repo')
      })
    })
  })
})