import './styles/Nav.css'
import { type FC, type HTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'

const Loader: FC = ({ ...props }: HTMLAttributes<HTMLDivElement>) => {
  const navigate = useNavigate()

  return (
    <nav data-testid="nav" {...props}>
      <Button type="button" onClick={() => navigate('/')} data-testid="back-btn">
        &larr; Back to search
      </Button>
    </nav>
  )
}

export default Loader