import './styles/Link.css'

export type LinkProps = {
  children: React.ReactNode
  href: string
  target?: string
} & React.HTMLAttributes<HTMLAnchorElement>

const Link: React.FC<LinkProps> = ({ children, href, target = '_blank', ...props }) => {
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