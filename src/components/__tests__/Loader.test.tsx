import { render, screen, type RenderResult } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import Loader from '../Loader'

describe('Loader', () => {
  const renderComponent = (): RenderResult => render(<Loader />)

  const elements = {
    get loader() { return screen.getByTestId('loader') },
  }

  describe('render', () => {
    beforeEach(renderComponent)

    it('should render a loader element', () => {
      expect(elements.loader).toBeInTheDocument()
    })
  })
})