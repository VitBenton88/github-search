import { type FC, type HTMLAttributes } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

const Loader: FC = ({ ...props }: HTMLAttributes<HTMLDivElement>) => {
  const navigate = useNavigate()

  return (
    <nav data-testid="nav" {...props}>
      <button type="button" onClick={() => navigate('/')} data-testid="back-btn">
        &larr; Back to search
      </button>
    </nav>
  )
}

export default Loader