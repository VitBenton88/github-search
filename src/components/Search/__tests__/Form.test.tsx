import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Form, { type SearchFormProps } from '../Form'
import userEvent from '@testing-library/user-event'
import { SearchContext, type SearchContextType } from '@/context/SearchContext'

const mockOnSubmit = vi.fn()
const mockSearchTerm = 'mock search term'

const mockDefaultProps: SearchFormProps = { disableForm: false, onSubmit: mockOnSubmit }

const mockContext: SearchContextType = {
  handleSearch: vi.fn(),
  hasSearched: false,
  isLoading: false,
  searchTerm: '',
  repositories: []
}

describe('Search Form', () => {
  const renderComponent = (propData = mockDefaultProps, contextValue = mockContext) => render(
    <SearchContext.Provider value={contextValue}>
      <Form {...propData} />
    </SearchContext.Provider>
  )

  const elements = {
    get fieldset() { return screen.getByTestId('fieldset') },
    get form() { return screen.getByTestId('form') },
    get popularCheckbox() { return screen.getByTestId('popularCheckbox') },
    get searchInput() { return screen.getByTestId('searchInput') },
    get submitBtn() { return screen.getByTestId('submitBtn') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(() => {
        act(() => {
          renderComponent()
        })
      })

      it('should render an enabled form', () => {
        const { fieldset, form } = elements

        expect(form).toBeInTheDocument()
        expect(fieldset).not.toHaveAttribute('disabled')
      })

      it('should render search input with no value', () => {
        expect(elements.searchInput).toHaveAttribute('value', '')
      })

      it('should render popular checkbox with no value', () => {
        expect(elements.popularCheckbox).not.toHaveAttribute('value')
      })

      it('should render submit button', () => {
        expect(elements.submitBtn).toBeInTheDocument()
      })
    })

    describe('with form disabled', () => {
      beforeEach(() => {
        act(() => {
          const propData = { ...mockDefaultProps, disableForm: true }
          renderComponent(propData)
        })
      })

      it('should render a disabled form', () => {
        const { fieldset, form } = elements

        expect(form).toBeInTheDocument()
        expect(fieldset).toHaveAttribute('disabled')
      })
    })

    describe('with a saved search term in context', () => {
      beforeEach(() => {
        act(() => {
          const contextData = { ...mockContext, searchTerm: mockSearchTerm }
          renderComponent(mockDefaultProps, contextData)
        })
      })

      it('should render search input with value', () => {
        expect(elements.searchInput).toHaveAttribute('value', mockSearchTerm)
      })
    })
  })

  describe('behavior', () => {
    describe('when submitting form', () => {
      beforeEach(async () => {
        act(() => {
          renderComponent()
        })

        const { searchInput, submitBtn } = elements

        await userEvent.type(searchInput, mockSearchTerm)
        await userEvent.click(submitBtn)
      })

      it('should call onSubmit prop function with correct values', async () => {
        expect(mockOnSubmit).toHaveBeenCalledWith(mockSearchTerm, false)
      })
    })
  })
})