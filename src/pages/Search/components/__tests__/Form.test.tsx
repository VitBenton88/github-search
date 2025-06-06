import { act, fireEvent, render, type RenderResult, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type SearchFormProps } from '../Form'
import { SearchForm } from '@/pages/Search/components'
import { SearchContext } from '@/context/SearchContext'
import { mockSearchContext } from '@mocks/contexts'
import type { SearchContextType } from '@/context/types'

const mockOnSubmit = vi.fn()
const mockSearchTerm = 'mock search term'
const mockDefaultProps: SearchFormProps = { disableForm: false, onFormSubmit: mockOnSubmit }

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
        expect(elements.popularCheckbox).not.toHaveAttribute('checked')
      })

      it('should render submit button', () => {
        expect(elements.submitBtn).toBeInTheDocument()
      })
    })

    describe('with form disabled', () => {
      beforeEach(() => {
        act(() => {
          const propData = { ...mockDefaultProps, disableForm: true }
          renderComponent(undefined, propData)
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
          const contextData = { ...mockSearchContext, hasSearched: true, searchTerm: mockSearchTerm }
          renderComponent(contextData, mockDefaultProps)
        })
      })

      it('should render search input with value', () => {
        expect(elements.searchInput).toHaveAttribute('value', mockSearchTerm)
      })
    })

    describe('with a saved search filter in context', () => {
      beforeEach(() => {
        act(() => {
          const contextData = { ...mockSearchContext, hasSearched: true, filterPopular: true }
          renderComponent(contextData, mockDefaultProps)
        })
      })

      it('should render filter input with correct value', () => {
        expect(elements.popularCheckbox).toHaveAttribute('checked')
      })
    })
  })

  describe('behavior', () => {
    describe('when submitting form', () => {
      beforeEach(async () => {
        waitFor(async () => {
          renderComponent()
          fireEvent.change(elements.searchInput, { target: { value: mockSearchTerm } })
          elements.submitBtn.click()
        })
      })

      it('should call onFormSubmit prop function with correct values', async () => {
        expect(mockOnSubmit).toHaveBeenCalledWith(mockSearchTerm, false)
      })
    })
  })
})