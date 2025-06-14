import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { NotificationContext } from '@/context/notification'
import { useNotification } from '@/hooks/useNotification'

const MockComponent = () => {
  const notify = useNotification()
  notify('Mock message', 'success')
  return <div>Test</div>
}

describe('useNotification', () => {
  it('returns notify function when used inside NotificationProvider', () => {
    const notifyMock = vi.fn()

    render(
      <NotificationContext.Provider value={{ notify: notifyMock, notification: null }}>
        <MockComponent />
      </NotificationContext.Provider>
    )

    expect(notifyMock).toHaveBeenCalledWith('Mock message', 'success')
  })
})