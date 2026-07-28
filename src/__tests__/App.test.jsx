import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

// App uses HashRouter internally; no need to wrap in another Router.
describe('App routing', () => {
  it('renders the login page at /login', () => {
    window.location.hash = '#/login';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });

  it('renders the skip link', () => {
    window.location.hash = '#/login';
    render(<App />);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to /login', () => {
    window.location.hash = '#/';
    render(<App />);
    // Without signing in, RequireAuth should bounce us to the login page
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });
});
