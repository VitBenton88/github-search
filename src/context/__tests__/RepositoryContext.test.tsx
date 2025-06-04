import { getRepository } from '@/api'
import { render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { mockRepo } from '@mocks/repositories'
import { MockRepositoryConsumer } from '@mocks/consumers'
import { RepositoryProvider } from '../RepositoryContext'

vi.mock('@/api', async () => {
  const actual = await vi.importActual('@/api')
  return {
    ...actual,
    getRepository: vi.fn(),
  }
})

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
  })
})