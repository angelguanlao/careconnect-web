import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Features from './pages/Features.jsx';
import Notifications from './pages/Notifications.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import Search from './pages/Search.jsx';
import PwaBanner from './components/PwaBanner.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { PreferencesProvider } from './context/PreferencesContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

// Gate the app shell behind demo auth; bounce to /login otherwise.
function RequireAuth({ children }) {
  const { signedIn } = useAuth();
  const location = useLocation();
  if (!signedIn) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

function SkipLink() {
  return <a className="skip-link" href="#main">Skip to main content</a>;
}

export default function App() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <ToastProvider>
          <HashRouter>
            <SkipLink />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
                <Route index element={<Dashboard />} />
                <Route path="features" element={<Features />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="search" element={<Search />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <PwaBanner />
          </HashRouter>
        </ToastProvider>
      </AuthProvider>
    </PreferencesProvider>
  );
}
