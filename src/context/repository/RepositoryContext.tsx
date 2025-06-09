import { createContext } from 'react'
import type { RepositoryContextType } from '@/context/repository/types'
import { defaultRepositoryContext } from '@/context/repository/repository.constants'

const RepositoryContext = createContext<RepositoryContextType>(defaultRepositoryContext)

export default RepositoryContext