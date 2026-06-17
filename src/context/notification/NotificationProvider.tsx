import { useCallback, useRef, useState } from 'react'
import type { Notification, NotificationType } from '@/context/notification/types'
import NotificationComponent from '@/components/Notification'
import { NotificationContext } from '@/context/notification'

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)

  const notify = useCallback((message: string, type: NotificationType, timeout = 4000) => {
    setNotification({ message, type })

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