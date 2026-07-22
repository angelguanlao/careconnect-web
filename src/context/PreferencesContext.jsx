import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Accessibility + layout preferences, persisted to localStorage and applied to
// <html>/<body> as data-attributes so the CSS token system can react. Parity
// with the desktop build's preference model.
const PREF_KEY = 'careconnect.prefs';

const DEFAULTS = {
  textScale: 1,
  highContrast: false,
  reduceMotion: false,
  textSpacing: false,
  leftHanded: false,
  panelVisible: true
};

const PreferencesContext = createContext(null);

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(PREF_KEY) || '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(load);

  // Reflect prefs onto the document + persist whenever they change.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = prefs.highContrast ? 'hc' : 'light';
    root.dataset.reduceMotion = String(prefs.reduceMotion);
    root.dataset.hand = prefs.leftHanded ? 'left' : 'right';
    root.style.setProperty('--text-scale', String(prefs.textScale));
    document.body.classList.toggle('text-spacing', prefs.textSpacing);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', prefs.highContrast ? '#000000' : '#0052CC');
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const update = useCallback((patch) => setPrefs((p) => ({ ...p, ...patch })), []);

  const setTextScale = useCallback((value) => {
    const clamped = Math.min(2, Math.max(0.8, Math.round(value * 10) / 10));
    setPrefs((p) => ({ ...p, textScale: clamped }));
  }, []);

  const value = { ...prefs, update, setTextScale };
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
