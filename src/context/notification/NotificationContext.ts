import { createContext } from 'react'
import type { NotificationContextType } from '@/context/types'

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined)