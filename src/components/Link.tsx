import './styles/Link.css'
import { type FC, type HTMLAttributes, type ReactNode } from 'react'

export type LinkProps = {
  children: ReactNode
  href: string
  target?: string
} & HTMLAttributes<HTMLAnchorElement>

const Link: FC<LinkProps> = ({ children, href, target = '_blank', ...props }) => {
  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      data-testid="link"
      {...props}
    >
      {children}
    </a>
  )
}

export default Link