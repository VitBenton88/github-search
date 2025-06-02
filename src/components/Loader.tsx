import { type FC, type HTMLAttributes } from 'react'
import './Loader.css'

const Loader: FC = ({ ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className="loader" role="status" aria-label="Loading" data-testid="loader" {...props}></span>
)

export default Loader