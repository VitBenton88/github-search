export type NotificationType = 'success' | 'error' | 'info'

export type NotificationMessage = {
  message: string
  type: NotificationType
}

export type NotificationContextType = {
  notify: (message: string, type: NotificationType, timeout?: number) => void
}
