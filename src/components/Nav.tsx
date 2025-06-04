import './styles/Nav.css'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'

type NavProps = React.HTMLAttributes<HTMLDivElement>

const Nav: React.FC<NavProps> = ({ ...props }) => {
  const navigate = useNavigate()

  return (
    <nav data-testid="nav" {...props}>
      <Button type="button" onClick={() => navigate('/')} data-testid="back-btn">
        &larr; Back to search
      </Button>
    </nav>
  )
}

export default Nav