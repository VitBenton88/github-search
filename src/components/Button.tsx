import './Button.css'
import { type ButtonHTMLAttributes, type FC } from 'react'

export type ButtonProps = {
  children: React.ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button data-testid="button" {...props}>
      {children}
    </button>
  )
}

export default Button