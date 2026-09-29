import { useParams } from 'react-router-dom'
import { Nav } from '@/components'
import { RepositoryProvider } from '@/context/repository'
import RepositoryMain from '@/pages/Repository/RepositoryMain'

const RepositoryWrapper: React.FC = () => {
  const { name, owner } = useParams<{ owner: string, name: string }>()

  return (
    <>
      <Nav data-testid="nav" />
      {/* Remount per repository so a new route never renders the previous repository's data. */}
      <RepositoryProvider key={`${owner}/${name}`}>
        <RepositoryMain />
      </RepositoryProvider>
    </>
  )
}

export default RepositoryWrapper
