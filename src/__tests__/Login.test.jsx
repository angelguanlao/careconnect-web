import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { PreferencesProvider } from '../context/PreferencesContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';
import Login from '../pages/Login.jsx';

// Mock useNavigate so we can assert navigation without a full router tree.
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

function renderLogin() {
  return render(
    <PreferencesProvider>
      <AuthProvider>
        <ToastProvider>
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        </ToastProvider>
      </AuthProvider>
    </PreferencesProvider>
  );
}

describe('Login page', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('renders the email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders the Sign in button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('shows an error for an invalid email', () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'bademail' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pw' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.');
  });

  it('shows an error when password is empty', () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Password is required.');
  });

  it('navigates to / on valid credentials', () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('toggles password visibility', () => {
    renderLogin();
    const pw = screen.getByLabelText('Password');
    expect(pw).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByLabelText('Show password'));
    expect(pw).toHaveAttribute('type', 'text');
    fireEvent.click(screen.getByLabelText('Hide password'));
    expect(pw).toHaveAttribute('type', 'password');
  });

  it('pre-fills email from localStorage when rememberEmail is set', () => {
    localStorage.setItem('careconnect.rememberEmail', 'saved@example.com');
    renderLogin();
    expect(screen.getByLabelText('Email address')).toHaveValue('saved@example.com');
  });

  it('remember checkbox is checked when email was stored', () => {
    localStorage.setItem('careconnect.rememberEmail', 'saved@example.com');
    renderLogin();
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
