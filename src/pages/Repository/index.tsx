import RepositoryPage from './RepositoryPage'
import { Nav } from '@/components'
import { RepositoryProvider } from '@/context/repository'

const RepositoryWrapper: React.FC = () => {
  return (
    <>
      <Nav data-testid="nav" />
      <RepositoryProvider>
        <RepositoryPage />
      </RepositoryProvider>
    </>
  )
}

export default RepositoryWrapper