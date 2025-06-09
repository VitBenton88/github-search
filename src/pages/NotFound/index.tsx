import { Nav } from '@/components'

const NotFound: React.FC = () => {

  return (
    <>
      <Nav data-testid="nav" />
      <h1 data-testid="heading">Page not found!</h1>
    </>
  )
}

export default NotFound