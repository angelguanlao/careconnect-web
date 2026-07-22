import { createContext, useContext, useState, useCallback, useRef } from 'react';
import Icon from '../components/Icon.jsx';

// Provides toast() for transient confirmations and announce() for silent
// screen-reader-only messages via a polite aria-live region.
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [liveMsg, setLiveMsg] = useState('');
  const timer = useRef(null);

  const announce = useCallback((msg) => {
    // Clear then set on the next frame so identical text re-announces.
    setLiveMsg('');
    requestAnimationFrame(() => setLiveMsg(msg));
  }, []);

  const showToast = useCallback((message, kind = 'success') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, kind });
    announce(message);
    timer.current = setTimeout(() => setToast(null), 4000);
  }, [announce]);

  const iconFor = (kind) => (kind === 'success' ? 'check' : kind === 'error' ? 'error' : kind === 'info' ? 'info' : 'warn');

  return (
    <ToastContext.Provider value={{ toast: showToast, announce }}>
      {children}
      {toast && (
        <div className={`toast ${toast.kind}`} role="status">
          <Icon id={iconFor(toast.kind)} size={18} />
          <span>{toast.message}</span>
        </div>
      )}
      <div className="sr-only" role="status" aria-live="polite">{liveMsg}</div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
