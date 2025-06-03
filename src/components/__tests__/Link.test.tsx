import { render, type RenderResult, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import Link, { type LinkProps } from '../Link'

const mockHref = 'https://test.com'
const mockTarget = '_self'
const mockDefaultProps: LinkProps = { href: mockHref, children: null }

describe('Link', () => {
  const renderComponent = (propData: LinkProps = mockDefaultProps): RenderResult =>
    render(<Link {...propData} />)

  const elements = {
    get link() { return screen.getByTestId('link') },
  }

  describe('render', () => {
    describe('with href prop', () => {
      beforeEach(() => {
        renderComponent()
      })

      it('should render an anchor element with the correct href value', () => {
        const { link } = elements

        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', mockHref)
      })
    })

    describe('with target prop', () => {
      beforeEach(() => {
        renderComponent({ ...mockDefaultProps, target: mockTarget })
      })

      it('should render an anchor element with the correct target value', () => {
        const { link } = elements

        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('target', mockTarget)
      })
    })
  })
})