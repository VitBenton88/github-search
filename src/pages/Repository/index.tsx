import { type FC } from 'react'
import Nav from '@/components/Nav'
import { RepositoryProvider } from '@/context/RepositoryContext'
import Repository from './Repository'

const RepositoryWrapper: FC = () => {
  return (
    <>
      <Nav />
      <RepositoryProvider>
        <Repository />
      </RepositoryProvider>
    </>
  )
}

export default RepositoryWrapper