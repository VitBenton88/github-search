import { createContext } from 'react'
import type { NotificationContextType } from '@/context/types'

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export default NotificationContext