import './styles/Loader.css'
import { type FC, type HTMLAttributes } from 'react'

const Loader: FC = ({ ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span aria-label="Loading" className="loader" role="status" data-testid="loader" {...props}></span>
)

export default Loader