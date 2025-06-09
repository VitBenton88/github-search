export type NotificationType = 'success' | 'error' | 'info'

export type Notification = {
  message: string
  type: NotificationType
}

export type NotificationContextType = {
  notification: Notification | null
  notify: (message: string, type: NotificationType) => void
}