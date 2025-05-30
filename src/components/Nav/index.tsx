import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

const Loader: FC = ({ ...props }) => {
  const navigate = useNavigate()

  return (
    <nav data-testid="nav" {...props}>
      <button data-testid="back-btn" type="button" onClick={() => navigate('/')}>
        &larr; Back to search
      </button>
    </nav>
  )
}

export default Loader