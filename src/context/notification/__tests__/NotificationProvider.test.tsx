

import { act, cleanup, render, type RenderResult, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NotificationProvider } from '@/context/notification'
import { useNotification } from '@/hooks/useNotification'

const TestComponent = () => {
  const notify = useNotification()
  return (
    <>
      <button onClick={() => notify('Test message', 'success')}>Trigger</button>
      <button onClick={() => notify('Test message', 'success', 1000)}>Trigger short</button>
    </>
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
    get shortButton() { return screen.getByText('Trigger short') },
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

    it('should dismiss after the default 4000ms', () => {
      act(() => { vi.advanceTimersByTime(3999) })
      expect(screen.queryByText('Test message')).toBeInTheDocument()

      act(() => { vi.advanceTimersByTime(1) })
      expect(screen.queryByText('Test message')).not.toBeInTheDocument()
    })

    it('should restart the timer when another notification is sent', () => {
      act(() => { vi.advanceTimersByTime(3000) })
      act(() => { elements.button.click() })
      act(() => { vi.advanceTimersByTime(3000) })

      expect(screen.queryByText('Test message')).toBeInTheDocument()
    })

    it('should honour a custom timeout', () => {
      act(() => { elements.shortButton.click() })
      act(() => { vi.advanceTimersByTime(1000) })

      expect(screen.queryByText('Test message')).not.toBeInTheDocument()
    })

    it('should clear its pending timer when unmounted', () => {
      cleanup()

      expect(vi.getTimerCount()).toBe(0)
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