import { Nav } from '@/components'
import { RepositoryProvider } from '@/context/repository'
import RepositoryMain from '@/pages/Repository/RepositoryMain'

const RepositoryWrapper: React.FC = () => {
  return (
    <>
      <Nav data-testid="nav" />
      <RepositoryProvider>
        <RepositoryMain />
      </RepositoryProvider>
    </>
  )
}

export default RepositoryWrapper