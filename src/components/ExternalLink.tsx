import { type FC, type HTMLAttributes, type ReactNode } from 'react'

export type ExternalLinkProps = {
  children: ReactNode
  href: string
  target?: string
} & HTMLAttributes<HTMLAnchorElement>

const ExternalLink: FC<ExternalLinkProps> = ({ children, href, target = '_blank', ...props }) => {
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

export default ExternalLink