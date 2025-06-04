import './styles/Button.css'

export type ButtonProps = {
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button data-testid="button" {...props}>
      {children}
    </button>
  )
}

export default Button