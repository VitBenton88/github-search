import { act, render, screen } from '@testing-library/react'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { useFocusMainOnRouteChange } from '@/hooks/useFocusMainOnRouteChange'

const HomePage: React.FC = () => (
  <main data-testid="home-main">
    <h1>Home</h1>
    <Link to="/other">Go to other page</Link>
  </main>
)

const OtherPage: React.FC = () => (
  <main data-testid="other-main">
    <h1>Other</h1>
  </main>
)

const TestHarness: React.FC = () => {
  useFocusMainOnRouteChange()

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/other" element={<OtherPage />} />
    </Routes>
  )
}

describe('useFocusMainOnRouteChange', () => {
  it('should move focus to the new page\'s <main> element after navigating', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestHarness />
      </MemoryRouter>
    )

    act(() => {
      screen.getByText('Go to other page').click()
    })

    expect(document.activeElement).toBe(screen.getByTestId('other-main'))
  })
})
