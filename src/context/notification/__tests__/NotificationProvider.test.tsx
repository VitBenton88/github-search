

import { act, render, type RenderResult, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NotificationProvider } from '@/context/notification'
import { useNotification } from '@/hooks/useNotification'

const TestComponent = () => {
  const notify = useNotification()
  return (
    <button onClick={() => notify('Test message', 'success')}>Trigger</button>
  )
}

describe('NotificationProvider', () => {
  const renderProvider = (): RenderResult =>
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

  const elements = {
    get button() { return screen.getByText('Trigger') },
    get notification() { return screen.getByText('Test message') },
    get region() { return screen.getByRole('status') },
  }

  describe('before notify is called', () => {
    beforeEach(() => {
      renderProvider()
    })

    // Screen readers only announce changes to a live region that already exists,
    // so the region must be in the DOM before any message is inserted into it.
    it('should render an empty live region', () => {
      expect(elements.region).toHaveAttribute('aria-live', 'polite')
      expect(elements.region).toBeEmptyDOMElement()
    })
  })

  describe('when notify is called', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    beforeEach(() => {
      vi.useFakeTimers()

      renderProvider()

      act(() => {
        elements.button.click()
      })
    })

    it('should render a notification that gets dismissed', () => {
      const { notification } = elements

      expect(notification).toBeInTheDocument()
      expect(notification.parentElement).toHaveClass('success')

      // Fast-forward until the notification should be dismissed
      act(() => {
        vi.runAllTimers()
      })

      expect(notification).not.toBeInTheDocument()
    })

    it('should render the notification inside the live region', () => {
      expect(elements.region).toContainElement(elements.notification)
    })

    it('should replace the notification node when the same message is sent again', () => {
      const first = elements.notification

      act(() => {
        elements.button.click()
      })

      // A fresh node makes screen readers re-announce identical text.
      expect(first).not.toBeInTheDocument()
      expect(elements.notification).toBeInTheDocument()
    })
  })
})