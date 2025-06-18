import { render } from '@testing-library/react'
import { describe, expect, it, type Mock, vi } from 'vitest'
import { NotificationContext } from '@/context/notification'
import { useNotification } from '@/hooks/useNotification'

const mockMessage: string = 'Mock message'

const MockComponent = (): React.ReactNode => {
  const notify = useNotification()
  notify(mockMessage, 'success')
  return <div>Test</div>
}

describe('useNotification', () => {
  it('returns notify function when used inside NotificationProvider', () => {
    const notifyMock: Mock = vi.fn()

    render(
      <NotificationContext.Provider value={{ notify: notifyMock, notification: null }}>
        <MockComponent />
      </NotificationContext.Provider>
    )

    expect(notifyMock).toHaveBeenCalledWith(mockMessage, 'success')
  })
})