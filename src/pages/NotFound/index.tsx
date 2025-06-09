import { Nav } from '@/components'
import './NotFound.css'

const NotFound: React.FC = () => {

  return (
    <>
      <Nav data-testid="nav" />
      <main id="not-found">
        <h1 data-testid="heading">Page not found!</h1>
      </main>
    </>
  )
}

export default NotFound