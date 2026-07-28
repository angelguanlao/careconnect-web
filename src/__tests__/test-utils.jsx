import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { PreferencesProvider } from '../context/PreferencesContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';

// Renders ui inside the full provider stack used by the real app.
// Pass route to pre-set the in-memory URL (e.g. '/search').
export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <PreferencesProvider>
      <AuthProvider>
        <ToastProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </ToastProvider>
      </AuthProvider>
    </PreferencesProvider>
  );
}

export * from '@testing-library/react';
