import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import Nav from '../index'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
})


describe('Nav', () => {
  const renderComponent = () => render(<Nav />);

  const elements = {
    get backBtn() { return screen.getByTestId('back-btn'); },
    get nav() { return screen.getByTestId('nav'); },
  };

  describe('render', () => {
    beforeEach(renderComponent)

    it('should render a nav element', () => {
      expect(elements.nav).toBeInTheDocument()
    })
  })

  describe('behavior', () => {
    describe('when clicking back button', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          renderComponent();
          await userEvent.click(elements.backBtn);
        })
      })

      it('should navigate user to home route', () => {
        expect(mockNavigate).toHaveBeenCalledWith('/')
      })
    });
  });
})