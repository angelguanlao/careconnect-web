import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext.jsx';

function AuthConsumer() {
  const { signedIn, user, signIn, signOut, updateUser } = useAuth();
  return (
    <div>
      <span data-testid="signed-in">{String(signedIn)}</span>
      <span data-testid="name">{user.name}</span>
      <span data-testid="email">{user.email}</span>
      <button onClick={() => signIn('test@example.com', false)}>Sign In</button>
      <button onClick={() => signIn('rem@example.com', true)}>Sign In Remember</button>
      <button onClick={signOut}>Sign Out</button>
      <button onClick={() => updateUser({ name: 'Jane Doe' })}>Update</button>
    </div>
  );
}

function renderConsumer() {
  render(<AuthProvider><AuthConsumer /></AuthProvider>);
}

describe('AuthContext', () => {
  it('starts signed out', () => {
    renderConsumer();
    expect(screen.getByTestId('signed-in').textContent).toBe('false');
  });

  it('loads default user name', () => {
    renderConsumer();
    expect(screen.getByTestId('name').textContent).toBe('Sarah Chen');
  });

  it('sets signedIn=true after signIn', () => {
    renderConsumer();
    act(() => screen.getByText('Sign In').click());
    expect(screen.getByTestId('signed-in').textContent).toBe('true');
  });

  it('updates the email on signIn', () => {
    renderConsumer();
    act(() => screen.getByText('Sign In').click());
    expect(screen.getByTestId('email').textContent).toBe('test@example.com');
  });

  it('stores email in localStorage when remember=true', () => {
    renderConsumer();
    act(() => screen.getByText('Sign In Remember').click());
    expect(localStorage.getItem('careconnect.rememberEmail')).toBe('rem@example.com');
  });

  it('removes email from localStorage when remember=false', () => {
    localStorage.setItem('careconnect.rememberEmail', 'old@example.com');
    renderConsumer();
    act(() => screen.getByText('Sign In').click());
    expect(localStorage.getItem('careconnect.rememberEmail')).toBeNull();
  });

  it('sets signedIn=false after signOut', () => {
    renderConsumer();
    act(() => screen.getByText('Sign In').click());
    act(() => screen.getByText('Sign Out').click());
    expect(screen.getByTestId('signed-in').textContent).toBe('false');
  });

  it('updateUser patches user state and persists to localStorage', () => {
    renderConsumer();
    act(() => screen.getByText('Update').click());
    expect(screen.getByTestId('name').textContent).toBe('Jane Doe');
    const stored = JSON.parse(localStorage.getItem('careconnect.user'));
    expect(stored.name).toBe('Jane Doe');
  });

  it('loads persisted user data from localStorage on mount', () => {
    localStorage.setItem('careconnect.user', JSON.stringify({ name: 'Stored User' }));
    renderConsumer();
    expect(screen.getByTestId('name').textContent).toBe('Stored User');
  });

  it('throws when useAuth is used outside AuthProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<AuthConsumer />)).toThrow('useAuth must be used within AuthProvider');
    spy.mockRestore();
  });
});
