import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { NAV_ITEMS } from '../data/mockData.js';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

// Authenticated application shell. Semantic landmarks:
//   <nav> banner     → primary navigation (dark sidebar on ≥768px)
//   <main>           → routed screen content (Outlet)
//   <nav> (mobile)   → fixed bottom tab bar on ≤767px
// Each page renders its own <header> row (title + actions) per the Figma.
export default function AppLayout() {
  const prefs = usePreferences();
  const { announce } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);

  // On route change: move focus to the screen heading for screen-reader
  // context, and announce the new screen.
  useEffect(() => {
    const heading = mainRef.current?.querySelector('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
      announce(`${heading.textContent} screen`);
    }
  }, [location.pathname, announce]);

  // Global keyboard shortcuts.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'F1') { e.preventDefault(); navigate('/settings'); return; }
      if (!(e.ctrlKey || e.metaKey)) return;
      switch (e.key) {
        case 'f': case 'F': e.preventDefault(); navigate('/search'); break;
        case ',': e.preventDefault(); navigate('/settings'); break;
        case '1': e.preventDefault(); navigate('/'); break;
        case '2': e.preventDefault(); navigate('/notifications'); break;
        case '3': e.preventDefault(); navigate('/profile'); break;
        case 'h': case 'H': if (e.altKey) { e.preventDefault(); prefs.update({ highContrast: !prefs.highContrast }); } break;
        default: break;
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navigate, prefs]);

  return (
    <div className="app">
      <nav className="sidebar" aria-label="Main navigation">
        <div className="brand">
          <div className="name">CareConnect</div>
          <div className="sub">Health Platform</div>
        </div>
        <div className="side-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.screen} to={item.path} end={item.path === '/'} className="side-link">
              <Icon id={item.icon} size={20} />
              <span>{item.label}</span>
              {item.badge ? <span className="count-badge" aria-label={`${item.badge} unread`}>{item.badge}</span> : null}
            </NavLink>
          ))}
        </div>
        <div className="sidebar-foot">WCAG 2.1 AA · PWA</div>
      </nav>

      <main className="content" id="main" ref={mainRef} tabIndex={-1}>
        <div className="content-inner">
          <Outlet />
          <footer className="app-footer">
            <span>© {new Date().getFullYear()} CareConnect · SWEN 661 Team 9</span>
            <nav aria-label="Footer">
              <a href="#main">Accessibility</a>
              <a href="#main">Privacy</a>
              <a href="#main">Contact</a>
            </nav>
          </footer>
        </div>
      </main>

      {/* Mobile bottom tab bar (≤767px) */}
      <nav className="bottom-nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.screen} to={item.path} end={item.path === '/'} className="bottom-link">
            <Icon id={item.icon} size={22} />
            <span>{item.label}</span>
            {item.badge ? <span className="count-badge" aria-hidden="true">{item.badge}</span> : null}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
