import { mockMultipleSearchResults } from '@mocks/repositories'
import { act, render, type RenderResult, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import type { SearchResultsProps } from '../Results'
import { SearchResults } from '@/pages/Search/components'

const mockNavigate: Mock = vi.fn()
const mockDefaultProps: SearchResultsProps = {
  caption: 'Search results',
  headers: ['Name', 'Description', 'Action'],
  items: mockMultipleSearchResults
}

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
        <SearchResults {...propData} />
      </MemoryRouter>
    )

  const elements = {
    get caption() { return screen.queryByTestId('caption') },
    get names() { return screen.queryAllByTestId('name') },
    get noneFound() { return screen.queryByTestId('none-found') },
    get results() { return screen.queryAllByTestId('result') },
    get table() { return screen.queryByTestId('table') },
    get tableHead() { return screen.queryByTestId('table-head') },
    get tableHeaders() { return screen.queryAllByTestId('table-header') },
    get viewMoreBtns() { return screen.getAllByTestId('view-more-btn') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(() => {
        renderComponent()
      })

      it('should render a table element with headers', () => {
        const { table, tableHead, tableHeaders } = elements

        expect(table).toBeInTheDocument()
        expect(tableHead).toBeInTheDocument()
        expect(tableHeaders.length).toBe(mockDefaultProps.headers.length)
      })

      it('should render the correct caption', () => {
        expect(elements.caption).toHaveTextContent(mockDefaultProps.caption)
      })

      it('should render the correct amount of results', () => {
        expect(elements.results.length).toBe(mockDefaultProps.items.length)
      })

      it('should render item data correctly', () => {
        expect(elements.names[0]).toHaveTextContent(mockMultipleSearchResults[0].name)
      })

      it('should not render a "none found" warning', () => {
        expect(elements.noneFound).not.toBeInTheDocument()
      })
    })

    describe('with no table headers', () => {
      beforeEach(() => {
        const propData = { ...mockDefaultProps, headers: [] }
        renderComponent(undefined, propData)
      })

      it('should render a table element with no headers', () => {
        const { table, tableHead, tableHeaders } = elements

        expect(table).toBeInTheDocument()
        expect(tableHead).not.toBeInTheDocument()
        expect(tableHeaders.length).toBe(0)
      })
    })

    describe('with no items', () => {
      beforeEach(() => {
        const propData = { ...mockDefaultProps, items: [] }
        renderComponent(undefined, propData)
      })

      it('should not render a table element', () => {
        expect(elements.table).not.toBeInTheDocument()
      })

      it('should render a "none found" warning', () => {
        expect(elements.noneFound).toBeInTheDocument()
      })
    })

    describe('with no caption', () => {
      beforeEach(() => {
        const propData = { ...mockDefaultProps, caption: '' }
        renderComponent(undefined, propData)
      })

      it('should not render a caption element', () => {
        expect(elements.caption).not.toBeInTheDocument()
      })
    })
  })

  describe('behavior', () => {
    describe('when clicking a result’s action', () => {
      beforeEach(() => {
        renderComponent()

        act(() => {
          elements.viewMoreBtns[0].click()
        })
      })

      it('should navigate user to correct destination', () => {
        const { name, owner } = mockMultipleSearchResults[0]

        expect(mockNavigate).toHaveBeenCalledWith(`/repo/${owner}/${name}`)
      })
    })
  })
})