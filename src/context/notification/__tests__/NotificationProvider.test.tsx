

import { act, render, type RenderResult, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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
  }

  describe('when notify is called', () => {
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

      vi.useRealTimers()
    })
  })
})