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
});
