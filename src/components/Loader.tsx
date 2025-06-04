import './styles/Loader.css'

type LoaderProps = React.HTMLAttributes<HTMLDivElement>

const Loader: React.FC<LoaderProps> = ({ ...props }) => (
  <span aria-label="Loading" className="loader" role="status" data-testid="loader" {...props}></span>
)

export default Loader