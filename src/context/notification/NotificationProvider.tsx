import { useCallback, useRef, useState } from 'react'
import type { Notification, NotificationType } from '@/context/notification/types'
import NotificationComponent from '@/components/Notification'
import { NotificationContext } from '@/context/notification'

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)
  // Changes on every notify so a repeated message renders a new node and is re-announced.
  const [notificationId, setNotificationId] = useState(0)

  const notify = useCallback((message: string, type: NotificationType, timeout = 4000) => {
    setNotification({ message, type })
    setNotificationId((id) => id + 1)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setNotification(null)
      timeoutRef.current = null
    }, timeout)
  }, [])

  return (
    <NotificationContext.Provider value={{ notify, notification }}>
      {/* Kept mounted: screen readers only announce changes to a live region that already exists. */}
      <div role="status" aria-live="polite">
        {notification && (
          <NotificationComponent
            key={notificationId}
            message={notification.message}
            type={notification.type}
          />
        )}
      </div>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider