import RepositoryPage from './RepositoryPage'
import { Nav } from '@/components'
import { RepositoryProvider } from '@/context/repository/RepositoryProvider'

const RepositoryWrapper: React.FC = () => {
  return (
    <>
      <Nav />
      <RepositoryProvider>
        <RepositoryPage />
      </RepositoryProvider>
    </>
  )
}

export default RepositoryWrapper