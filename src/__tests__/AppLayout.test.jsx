import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { PreferencesProvider } from '../context/PreferencesContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';

function renderLayout(initialPath = '/') {
  return render(
    <PreferencesProvider>
      <AuthProvider>
        <ToastProvider>
          <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<h1>Dashboard</h1>} />
                <Route path="search" element={<h1>Search</h1>} />
                <Route path="settings" element={<h1>Settings</h1>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </ToastProvider>
      </AuthProvider>
    </PreferencesProvider>
  );
}

describe('AppLayout', () => {
  it('renders the main navigation sidebar', () => {
    renderLayout();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('renders the CareConnect brand name in the sidebar', () => {
    renderLayout();
    expect(screen.getByText('CareConnect')).toBeInTheDocument();
  });

  it('renders the mobile bottom nav', () => {
    renderLayout();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });

  it('renders the main content area with id="main"', () => {
    renderLayout();
    expect(document.getElementById('main')).toBeInTheDocument();
  });

  it('renders all five nav links in the sidebar', () => {
    renderLayout();
    const sidebar = screen.getByRole('navigation', { name: 'Main navigation' });
    const links = sidebar.querySelectorAll('a');
    expect(links.length).toBeGreaterThanOrEqual(5);
  });

  it('renders the Alerts badge count in the sidebar', () => {
    renderLayout();
    expect(screen.getByLabelText('3 unread')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    renderLayout();
    expect(screen.getByText(/CareConnect · SWEN 661/)).toBeInTheDocument();
  });

  it('renders the outlet content', () => {
    renderLayout();
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('navigates to settings via Ctrl+, keyboard shortcut', () => {
    renderLayout();
    fireEvent.keyDown(document, { key: ',', ctrlKey: true });
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });

  it('navigates to search via Ctrl+F keyboard shortcut', () => {
    renderLayout();
    fireEvent.keyDown(document, { key: 'f', ctrlKey: true });
    expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument();
  });
});
