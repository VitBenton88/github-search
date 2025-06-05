import { getRepository } from '@/api'
import { render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { mockRepo } from '@mocks/repositories'
import { MockRepositoryConsumer } from '@mocks/consumers'
import { RepositoryProvider } from '../RepositoryContext'

const mockNotify = vi.fn()

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

describe('SearchContext', () => {
  const renderContext = (children: React.ReactNode = (<MockRepositoryConsumer />)): RenderResult => {
    return render(
      <RepositoryProvider>
        {children}
      </RepositoryProvider>
    )
  }

  const elements = {
    get fetchBtn() { return screen.getByTestId('fetch-button') },
    get isLoading() { return screen.getByTestId('isLoading') },
    get repoId() { return screen.getByTestId('repo-id') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(async () => {
        await waitFor(() => {
          renderContext()
        })
      })

      it('should render children', () => {
        const { fetchBtn, isLoading, repoId } = elements

        expect(fetchBtn).toBeInTheDocument()
        expect(isLoading).toHaveTextContent('is loading')
        expect(repoId).toHaveTextContent('')
      })
    })
  })

  describe('behavior', () => {
    describe('when searching', () => {
      beforeEach(async () => {
        (getRepository as Mock).mockResolvedValue(mockRepo)

        await waitFor(async () => {
          renderContext()
          await userEvent.click(elements.fetchBtn)
        })
      })

      it('should call fetch method with correct repo owner and name', () => {
        expect(getRepository).toHaveBeenCalledWith('mock owner', 'mock name')
      })

      it('should render correct id', () => {
        expect(elements.repoId).toHaveTextContent(mockRepo.id)
      })
    })

    describe('when fetch error is thrown', () => {
      beforeEach(async () => {
        (getRepository as Mock).mockRejectedValue(new Error('Mock Rejection'))

        await waitFor(async () => {
          renderContext()
          await userEvent.click(elements.fetchBtn)
        })
      })

      it('should call notify hook as error', () => {
        expect(mockNotify).toHaveBeenCalledWith('Mock Rejection', 'error')
      })
    })
  })
})