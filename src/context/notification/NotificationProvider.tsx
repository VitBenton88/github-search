import { useCallback, useRef, useState } from 'react'
import type { Notification, NotificationType } from '@/context/notification/types'
import NotificationComponent from '@/components/Notification'
import { NotificationContext } from '@/context/notification'

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)

  const notify = useCallback((message: string, type: NotificationType, timeout = 4000) => {
    setNotification({ message, type })

    // Clear existing timeout if it's still pending
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set a new timeout to clear the message
    timeoutRef.current = setTimeout(() => {
      reset()
    }, timeout)

  }, [setNotification, timeoutRef])

  const reset = () => {
    setNotification(null)
    timeoutRef.current = null
  }

  return (
    <NotificationContext.Provider value={{ notify, notification }}>
      {notification && (
        <NotificationComponent
          message={notification.message}
          type={notification.type}
        />
      )}
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider