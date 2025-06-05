import { Nav } from '@/components'
import { RepositoryProvider } from '@/context/RepositoryContext'
import Repository from './Repository'

const RepositoryWrapper: React.FC = () => {
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