import { act, render, type RenderResult, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import Notification, { type NotificationProps } from '../Notification'

const mockDefaultProps: NotificationProps = {
  message: 'mock message',
  type: 'success'
}

describe('Notification', () => {
  const renderComponent = (propData: NotificationProps = mockDefaultProps): RenderResult =>
    render(<Notification {...propData} />)

  const elements = {
    get message() { return screen.getByTestId('message') },
    get notification() { return screen.getByTestId('notification') },
  }

  describe('render', () => {
    beforeEach(() => {
      act(() => {
        renderComponent()
      })
    })

    it('should render a notification parent element with correct class', () => {
      expect(elements.notification).toBeInTheDocument()
      expect(elements.notification).toHaveClass(mockDefaultProps.type)
    })

    it('should render a message element with correct text', () => {
      expect(elements.message).toBeInTheDocument()
      expect(elements.message).toHaveTextContent(mockDefaultProps.message)
    })
  })
})