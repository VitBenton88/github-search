import './styles/Notification.css'

export type NotificationProps = {
  message: string
  type: string
} & React.HTMLAttributes<HTMLDivElement>

const Notification: React.FC<NotificationProps> = ({ message, type, ...props }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`notification ${type}`}
      data-testid="notification"
      {...props}
    >
      <span data-testid="message">{message}</span>
    </div>
  )
}

export default Notification