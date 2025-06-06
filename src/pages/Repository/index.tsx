import Repository from './Repository'
import { Nav } from '@/components'
import { RepositoryProvider } from '@/context/repository/RepositoryProvider'

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