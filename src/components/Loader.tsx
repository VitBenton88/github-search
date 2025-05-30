import type { FC } from 'react'
import './Loader.css'

const Loader: FC = ({ ...props }) => <span className="loader" role="status" aria-label="Loading" data-testid="loader" {...props}></span>

export default Loader