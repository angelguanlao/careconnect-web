import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils.jsx';
import Settings from '../pages/Settings.jsx';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Settings page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    // Preferences persist to localStorage, so without this a toggle flipped in
    // one test leaks into the next and the suite stops being order-independent.
    localStorage.clear();
    renderWithProviders(<Settings />);
  });

  it('renders the Settings heading', () => {
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });

  it('renders the Accessibility section', () => {
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
  });

  it('renders the High contrast mode toggle', () => {
    expect(screen.getByRole('switch', { name: 'High contrast mode' })).toBeInTheDocument();
  });

  it('renders the Reduce motion toggle', () => {
    expect(screen.getByRole('switch', { name: 'Reduce motion' })).toBeInTheDocument();
  });

  it('renders the Screen reader optimizations toggle', () => {
    expect(screen.getByRole('switch', { name: 'Screen reader optimizations' })).toBeInTheDocument();
  });

  it('renders the Notifications section', () => {
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('renders the Push notifications toggle', () => {
    expect(screen.getByRole('switch', { name: 'Push notifications' })).toBeInTheDocument();
  });

  it('renders the Email notifications toggle', () => {
    expect(screen.getByRole('switch', { name: 'Email notifications' })).toBeInTheDocument();
  });

  it('renders the Language select', () => {
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
  });

  it('renders the Sign out button', () => {
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('navigates to /login when Sign out is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('toggles high contrast on click', () => {
    const toggle = screen.getByRole('switch', { name: 'High contrast mode' });
    const before = toggle.getAttribute('aria-checked');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-checked')).not.toBe(before);
  });

  it('text size slider is present', () => {
    expect(screen.getByRole('slider', { name: 'Text size' })).toBeInTheDocument();
  });

  it('decrease text size button is present', () => {
    expect(screen.getByLabelText('Decrease text size')).toBeInTheDocument();
  });

  it('increase text size button is present', () => {
    expect(screen.getByLabelText('Increase text size')).toBeInTheDocument();
  });

  // --- Behaviour: every switch is actually operated, not just rendered ------
  // Each onChange handler both writes the preference and announces the change,
  // so these also cover the announce() calls.
  it.each([
    ['Reduce motion'],
    ['Screen reader optimizations'],
    ['Push notifications'],
    ['Email notifications'],
  ])('toggles the %s switch', (name) => {
    const toggle = screen.getByRole('switch', { name });
    const before = toggle.getAttribute('aria-checked');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-checked')).not.toBe(before);
  });

  it('toggles a switch back to its original state on a second click', () => {
    const toggle = screen.getByRole('switch', { name: 'Reduce motion' });
    const before = toggle.getAttribute('aria-checked');
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-checked')).toBe(before);
  });

  // --- Behaviour: text size controls ---------------------------------------
  it('increases the text size when the increase button is clicked', () => {
    expect(screen.getByText(/Text size — 16px/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Increase text size'));
    expect(screen.getByText(/Text size — 18px/)).toBeInTheDocument();
  });

  it('decreases the text size when the decrease button is clicked', () => {
    fireEvent.click(screen.getByLabelText('Decrease text size'));
    expect(screen.getByText(/Text size — 14px/)).toBeInTheDocument();
  });

  it('updates the text size from the slider', () => {
    const slider = screen.getByRole('slider', { name: 'Text size' });
    fireEvent.change(slider, { target: { value: '1.5' } });
    expect(screen.getByText(/Text size — 24px/)).toBeInTheDocument();
  });

  it('exposes the text size to screen readers via aria-valuetext', () => {
    const slider = screen.getByRole('slider', { name: 'Text size' });
    fireEvent.change(slider, { target: { value: '1.5' } });
    expect(slider).toHaveAttribute('aria-valuetext', '24 pixels');
  });

  it('clamps the text size at the 2x maximum', () => {
    const slider = screen.getByRole('slider', { name: 'Text size' });
    fireEvent.change(slider, { target: { value: '2' } });
    fireEvent.click(screen.getByLabelText('Increase text size'));
    expect(screen.getByText(/Text size — 32px/)).toBeInTheDocument();
  });

  it('clamps the text size at the 0.8x minimum', () => {
    const slider = screen.getByRole('slider', { name: 'Text size' });
    fireEvent.change(slider, { target: { value: '0.8' } });
    fireEvent.click(screen.getByLabelText('Decrease text size'));
    expect(screen.getByText(/Text size — 13px/)).toBeInTheDocument();
  });

  // --- Behaviour: account section ------------------------------------------
  it('confirms the change when a language is selected', () => {
    fireEvent.change(screen.getByLabelText('Language'), { target: { value: 'es' } });
    expect(screen.getByText(/Language preference saved/)).toBeInTheDocument();
  });
});
