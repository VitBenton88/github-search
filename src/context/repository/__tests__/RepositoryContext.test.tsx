import { MockRepositoryConsumer } from '@mocks/consumers'
import { mockRepo } from '@mocks/repositories'
import { render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { getRepository } from '@/api'
import { RepositoryProvider } from '@/context/repository'

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
    get repoId() { return screen.getByTestId('repo-id') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(() => {
        renderContext()
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

        await waitFor(() => {
          renderContext()
          elements.fetchBtn.click()
        })
      })

      it('should call fetch method with correct repo owner and name', () => {
        expect(getRepository).toHaveBeenCalledWith('mock owner', 'mock name')
      })

      it('should render correct id', () => {
        expect(elements.repoId).toHaveTextContent(mockRepo.id.toString())
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
  })
})