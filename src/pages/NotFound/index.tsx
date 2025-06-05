import { Nav } from '@/components'

const NotFoundRedirect: React.FC = () => {

  return (
    <>
      <Nav data-testid="nav" />
      <h1 data-testid="heading">Page not found!</h1>
    </>
  )
}

export default NotFoundRedirect