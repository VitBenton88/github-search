import { createContext } from 'react'
import type { RepositoryContextType } from '@/context/types'
import { defaultRepositoryContext } from '@/context/repository/repository.constants'

const RepositoryContext = createContext<RepositoryContextType>(defaultRepositoryContext)

export default RepositoryContext