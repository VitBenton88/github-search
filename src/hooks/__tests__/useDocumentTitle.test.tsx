import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const TestComponent: React.FC<{ pageTitle?: string }> = ({ pageTitle }) => {
  useDocumentTitle(pageTitle)
  return null
}

describe('useDocumentTitle', () => {
  it('should set document.title to the site title when no page title is given', () => {
    render(<TestComponent />)

    expect(document.title).toBe('GitHub Search')
  })

  it('should prefix document.title with the given page title', () => {
    render(<TestComponent pageTitle="octocat/Hello-World" />)

    expect(document.title).toBe('octocat/Hello-World · GitHub Search')
  })
})
