import { mockSearchContext } from '@mocks/contexts'
import { act, fireEvent, render, type RenderResult, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { type SearchFormProps } from '../Form'
import type { SearchContextType } from '@/context/search/types'
import { SearchContext } from '@/context/search'
import { SearchForm } from '@/pages/Search/components'

const mockOnSubmit: Mock = vi.fn()
const mockSearchTerm = 'mock search term'
const mockDefaultProps: SearchFormProps = {
  disableForm: false,
  onFormSubmit: mockOnSubmit
}

describe('Search Form', () => {
  const renderComponent = (
    contextValue: SearchContextType = mockSearchContext,
    propData: SearchFormProps = mockDefaultProps
  ): RenderResult => render(
    <SearchContext.Provider value={contextValue}>
      <SearchForm {...propData} />
    </SearchContext.Provider>
  )

  const elements = {
    get fieldset() { return screen.getByTestId('fieldset') },
    get form() { return screen.getByTestId('form') },
    get popularCheckbox() { return screen.getByTestId('popular-checkbox') },
    get searchInput() { return screen.getByTestId('search-input') },
    get submitBtn() { return screen.getByTestId('submit-btn') },
  }

  describe('render', () => {
    describe('default', () => {
      beforeEach(() => {
        renderComponent()
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
        expect(elements.popularCheckbox).not.toHaveAttribute('checked')
      })

      it('should render submit button', () => {
        expect(elements.submitBtn).toBeInTheDocument()
      })
    })

    describe('with form disabled', () => {
      beforeEach(() => {
        const propData = { ...mockDefaultProps, disableForm: true }
        renderComponent(undefined, propData)
      })

      it('should render a disabled form', () => {
        const { fieldset, form } = elements

        expect(form).toBeInTheDocument()
        expect(fieldset).toHaveAttribute('disabled')
      })
    })

    describe('with a saved search term in context', () => {
      beforeEach(() => {
        const contextData = { ...mockSearchContext, hasSearched: true, searchTerm: mockSearchTerm }
        renderComponent(contextData, mockDefaultProps)
      })

      it('should render search input with value', () => {
        expect(elements.searchInput).toHaveAttribute('value', mockSearchTerm)
      })
    })

    describe('with a saved search filter in context', () => {
      beforeEach(() => {
        const contextData = { ...mockSearchContext, hasSearched: true, filterPopular: true }
        renderComponent(contextData, mockDefaultProps)
      })

      it('should render filter input with correct value', () => {
        expect(elements.popularCheckbox).toHaveAttribute('checked')
      })
    })
  })

  describe('behavior', () => {
    describe('when submitting form', () => {
      beforeEach(() => {
        renderComponent()
        fireEvent.change(elements.searchInput, { target: { value: mockSearchTerm } })

        act(() => {
          elements.submitBtn.click()
        })
      })

      it('should call onFormSubmit prop function with correct values', async () => {
        expect(mockOnSubmit).toHaveBeenCalledWith(mockSearchTerm, false)
      })
    })
  })
})