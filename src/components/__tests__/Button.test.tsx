import { render, type RenderResult, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import Button, { type ButtonProps } from '../Button'

const mockDefaultProps: ButtonProps = { children: null }

describe('Button', () => {
  const renderComponent = (propData: ButtonProps = mockDefaultProps): RenderResult =>
    render(<Button {...propData} />)

  const elements = {
    get button() { return screen.getByTestId('button') },
  }

  describe('render', () => {
    beforeEach(renderComponent)

    it('should render a button element', () => {
      expect(elements.button).toBeInTheDocument()
    })
  })

  describe('props forwarding', () => {
    it('forwards aria-label prop', () => {
      render(<Button aria-label="Close dialog">×</Button>)

      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog')
    })
  })
})