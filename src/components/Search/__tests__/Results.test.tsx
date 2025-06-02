import { render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Results from '../Results'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { mockBasicRepos } from '@mocks/repositories'
import type { SearchResultsProps } from '../Results'

const mockNavigate = vi.fn()
const mockDefaultProps: SearchResultsProps = { items: mockBasicRepos }

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Search Results', () => {
  const renderComponent = (
    initialEntries: string[] = ['/'],
    propData: SearchResultsProps = mockDefaultProps
  ): RenderResult =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Results {...propData} />
      </MemoryRouter>
    )

  const elements = {
    get names() { return screen.queryAllByTestId('name') },
    get noneFound() { return screen.queryByTestId('noneFound') },
    get results() { return screen.queryAllByTestId('result') },
    get table() { return screen.queryByTestId('table') },
    get viewMoreBtns() { return screen.getAllByTestId('viewMoreBtn') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(async () => {
        await waitFor(() => {
          renderComponent()
        })
      })

      it('should render a table element', () => {
        expect(elements.table).toBeInTheDocument()
      })

      it('should render the correct amount of results', () => {
        expect(elements.results.length).toBe(mockBasicRepos.length)
      })

      it('should render item data correctly', () => {
        expect(elements.names[0]).toHaveTextContent(mockBasicRepos[0].name)
      })

      it('should not render a "none found" warning', () => {
        expect(elements.noneFound).not.toBeInTheDocument()
      })
    })

    describe('with no items', () => {
      beforeEach(async () => {
        await waitFor(() => {
          const propData = { ...mockDefaultProps, items: [] }
          renderComponent(undefined, propData)
        })
      })

      it('should not render a table element', () => {
        expect(elements.table).not.toBeInTheDocument()
      })

      it('should render a "none found" warning', () => {
        expect(elements.noneFound).toBeInTheDocument()
      })
    })
  })

  describe('behavior', () => {
    describe('when clicking a result’s action', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          renderComponent()
          await userEvent.click(elements.viewMoreBtns[0])
        })
      })

      it('should navigate user to correct destination', () => {
        const { name, owner } = mockBasicRepos[0]

        expect(mockNavigate).toHaveBeenCalledWith(`/repo/${owner}/${name}`)
      })
    })
  })
})