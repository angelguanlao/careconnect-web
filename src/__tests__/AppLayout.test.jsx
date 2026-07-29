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
                <Route path="notifications" element={<h1>Notifications</h1>} />
                <Route path="profile" element={<h1>Profile</h1>} />
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

  // --- The remaining global shortcuts --------------------------------------
  it.each([
    ['1', 'Dashboard'],
    ['2', 'Notifications'],
    ['3', 'Profile'],
  ])('navigates via Ctrl+%s to %s', (key, heading) => {
    renderLayout('/settings');
    fireEvent.keyDown(document, { key, ctrlKey: true });
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });

  it('accepts Cmd as well as Ctrl for shortcuts', () => {
    renderLayout();
    fireEvent.keyDown(document, { key: 'f', metaKey: true });
    expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument();
  });

  it('handles the uppercase form of a shortcut key', () => {
    renderLayout();
    fireEvent.keyDown(document, { key: 'F', ctrlKey: true });
    expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument();
  });

  it('navigates to settings via F1', () => {
    renderLayout();
    fireEvent.keyDown(document, { key: 'F1' });
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });

  it('toggles high contrast via Ctrl+Alt+H', () => {
    renderLayout();
    const before = document.documentElement.dataset.theme;
    fireEvent.keyDown(document, { key: 'h', ctrlKey: true, altKey: true });
    expect(document.documentElement.dataset.theme).not.toBe(before);
  });

  it('ignores a bare key press with no modifier', () => {
    renderLayout();
    fireEvent.keyDown(document, { key: 'f' });
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('ignores an unmapped modifier combination', () => {
    renderLayout();
    fireEvent.keyDown(document, { key: 'q', ctrlKey: true });
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  // --- Focus management on route change ------------------------------------
  it('moves focus to the h1 of the newly routed screen', () => {
    renderLayout();
    fireEvent.keyDown(document, { key: ',', ctrlKey: true });
    const heading = screen.getByRole('heading', { name: 'Settings' });
    expect(heading).toHaveFocus();
  });

  it('makes the routed heading programmatically focusable', () => {
    renderLayout();
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toHaveAttribute('tabindex', '-1');
  });
});
