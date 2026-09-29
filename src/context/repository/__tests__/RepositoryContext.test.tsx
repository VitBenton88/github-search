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
    beforeEach(() => {
      mockNotify.mockClear()
    })

    // Mirror fetch: reject with an AbortError once the request's signal is aborted. Browsers'
    // DOMException is an Error, but jsdom's isn't, so use a plain Error named AbortError.
    const mockAbortableFetch = (signals: AbortSignal[], resolvers: ((value: RepositoryType) => void)[]) => {
      (getRepository as Mock).mockImplementation((_owner: string, _name: string, signal: AbortSignal) =>
        new Promise((resolve, reject) => {
          signals.push(signal)
          resolvers.push(resolve)
          signal.addEventListener('abort', () => reject(Object.assign(new Error('The operation was aborted.'), { name: 'AbortError' })))
        })
      )
    }

    const flushPromises = async (): Promise<void> => {
      await act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)) })
    }

    describe('when fetching', () => {
      beforeEach(async () => {
        (getRepository as Mock).mockResolvedValue(mockRepository)

        renderContext()
        act(() => {
          elements.fetchBtn.click()
        })

        await waitFor(() => {
          expect(elements.isLoading).toHaveTextContent('is not loading')
        })
      })

      it('should call fetch method with correct repo owner and name', () => {
        expect(getRepository).toHaveBeenCalledWith('mock owner', 'mock name', expect.any(AbortSignal))
      })
    })

    describe('when fetch error is thrown', () => {
      beforeEach(async () => {
        (getRepository as Mock).mockRejectedValue(new Error('Mock Rejection'))

        renderContext()
        act(() => {
          elements.fetchBtn.click()
        })

        await waitFor(() => {
          expect(elements.isLoading).toHaveTextContent('is not loading')
        })
      })

      it('should call notify hook as error', () => {
        expect(mockNotify).toHaveBeenCalledWith('Mock Rejection', 'error')
      })
    })

    describe('when unmounted while a fetch is in flight', () => {
      it('should abort the request without surfacing its rejection', async () => {
        const signals: AbortSignal[] = []
        mockAbortableFetch(signals, [])

        const { unmount } = renderContext()
        act(() => {
          elements.fetchBtn.click()
        })

        unmount()
        await flushPromises()

        expect(signals[0].aborted).toBe(true)
        expect(mockNotify).not.toHaveBeenCalled()
      })
    })

    describe('when a newer fetch is submitted before an older one resolves', () => {
      const RaceConditionConsumer = (): React.ReactNode => {
        const context = useContext(RepositoryContext)

        return (
          <>
            <div data-testid="repo-name">{context.repository.name}</div>
            <div data-testid="is-loading">{context.isLoading ? 'is loading' : 'is not loading'}</div>
            <button data-testid="fetch-first" onClick={() => { void context.handleFetch('owner', 'first') }}>first</button>
            <button data-testid="fetch-second" onClick={() => { void context.handleFetch('owner', 'second') }}>second</button>
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
        resolveSecond(secondRepo)
        resolveFirst(firstRepo)

        await waitFor(() => {
          expect(screen.getByTestId('repo-name')).toHaveTextContent('second-repo')
        })
        expect(screen.getByTestId('repo-name')).not.toHaveTextContent('first-repo')
      })

      it('should abort the older request without surfacing its rejection or clearing the loading state', async () => {
        const secondRepo: RepositoryType = { ...mockRepository, id: 2, name: 'second-repo' }
        const signals: AbortSignal[] = []
        const resolvers: ((value: RepositoryType) => void)[] = []
        mockAbortableFetch(signals, resolvers)

        renderContext(<RaceConditionConsumer />)

        act(() => {
          screen.getByTestId('fetch-first').click()
          screen.getByTestId('fetch-second').click()
        })

        expect(signals[0].aborted).toBe(true)
        expect(signals[1].aborted).toBe(false)

        await flushPromises()

        expect(mockNotify).not.toHaveBeenCalled()
        expect(screen.getByTestId('is-loading')).toHaveTextContent('is loading')

        act(() => { resolvers[1](secondRepo) })

        await waitFor(() => {
          expect(screen.getByTestId('is-loading')).toHaveTextContent('is not loading')
        })
        expect(screen.getByTestId('repo-name')).toHaveTextContent('second-repo')
      })
    })
  })
})
