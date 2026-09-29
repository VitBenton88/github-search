import './styles/Nav.css'
import { Link } from 'react-router-dom'

type NavProps = React.HTMLAttributes<HTMLElement>

const Nav: React.FC<NavProps> = (props) => {
  return (
    <nav data-testid="nav" {...props}>
      <Link to="/" data-testid="back-link">
        &larr; Back to search
      </Link>
    </nav>
  )
}

export default Nav
