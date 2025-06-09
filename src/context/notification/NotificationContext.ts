import { createContext } from 'react'
import type { NotificationContextType } from '@/context/notification/types'

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export default NotificationContext