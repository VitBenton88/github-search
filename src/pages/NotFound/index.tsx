import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { type FC } from 'react'

const NotFoundRedirect: FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/', { state: { error: 'Page not found' }, replace: true })
  }, [navigate])

  return null
}

export default NotFoundRedirect