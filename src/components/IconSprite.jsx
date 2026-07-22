// Inline SVG symbol sprite. Rendered once at the app root; every <Icon>
// references a symbol by id. Meaning never relies on color alone — icons pair
// with text labels throughout the UI. Line icons are Lucide-style (MIT).
export default function IconSprite() {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="i-heart" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></symbol>
        <symbol id="i-home" viewBox="0 0 24 24"><path {...s} d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" /></symbol>
        <symbol id="i-list" viewBox="0 0 24 24"><path {...s} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></symbol>
        <symbol id="i-bell" viewBox="0 0 24 24"><path {...s} d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" /></symbol>
        <symbol id="i-user" viewBox="0 0 24 24"><path {...s} d="M20 21a8 8 0 10-16 0" /><circle cx="12" cy="8" r="4" {...s} /></symbol>
        <symbol id="i-users" viewBox="0 0 24 24"><path {...s} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" {...s} /><path {...s} d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></symbol>
        <symbol id="i-gear" viewBox="0 0 24 24"><g {...s}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></g></symbol>
        <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" {...s} /><path {...s} d="M21 21l-4-4" /></symbol>
        <symbol id="i-eye" viewBox="0 0 24 24"><path {...s} d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" {...s} /></symbol>
        <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" {...s} /><path {...s} d="M3 7l9 6 9-6" /></symbol>
        <symbol id="i-lock" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="10" rx="2" {...s} /><path {...s} d="M8 11V7a4 4 0 018 0v4" /></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path {...s} d="M20 6L9 17l-5-5" /></symbol>
        <symbol id="i-check-circle" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...s} /><path {...s} d="M8 12l3 3 5-6" /></symbol>
        <symbol id="i-warn" viewBox="0 0 24 24"><path {...s} d="M12 3l9 16H3z" /><path {...s} d="M12 9v5M12 17v.01" /></symbol>
        <symbol id="i-error" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...s} /><path {...s} d="M12 7v6M12 16v.01" /></symbol>
        <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...s} /><path {...s} d="M12 11v5M12 8v.01" /></symbol>
        <symbol id="i-chevron" viewBox="0 0 24 24"><path {...s} d="M9 6l6 6-6 6" /></symbol>
        <symbol id="i-edit" viewBox="0 0 24 24"><path {...s} d="M4 20h4L19 9l-4-4L4 16z" /></symbol>
        <symbol id="i-x" viewBox="0 0 24 24"><path {...s} d="M6 6l12 12M18 6L6 18" /></symbol>
        <symbol id="i-menu" viewBox="0 0 24 24"><path {...s} d="M4 6h16M4 12h16M4 18h16" /></symbol>
        <symbol id="i-plus" viewBox="0 0 24 24"><path {...s} d="M12 5v14M5 12h14" /></symbol>
        <symbol id="i-minus" viewBox="0 0 24 24"><path {...s} d="M5 12h14" /></symbol>
        <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" {...s} /><path {...s} d="M16 2v4M8 2v4M3 10h18" /></symbol>
        <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...s} /><path {...s} d="M12 7v5l3 2" /></symbol>
        <symbol id="i-activity" viewBox="0 0 24 24"><path {...s} d="M22 12h-4l-3 9L9 3l-3 9H2" /></symbol>
        <symbol id="i-pill" viewBox="0 0 24 24"><path {...s} d="M10.5 20.5a5 5 0 01-7-7l6-6a5 5 0 017 7z" /><path {...s} d="M8.5 8.5l7 7" /></symbol>
        <symbol id="i-phone" viewBox="0 0 24 24"><path {...s} d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.4-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" /></symbol>
        <symbol id="i-video" viewBox="0 0 24 24"><rect x="2" y="6" width="14" height="12" rx="2" {...s} /><path {...s} d="M22 8l-6 4 6 4z" /></symbol>
        <symbol id="i-shield" viewBox="0 0 24 24"><path {...s} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></symbol>
        <symbol id="i-file" viewBox="0 0 24 24"><path {...s} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path {...s} d="M14 2v6h6M8 13h8M8 17h8M8 9h2" /></symbol>
        <symbol id="i-message" viewBox="0 0 24 24"><path {...s} d="M21 11.5a8.4 8.4 0 01-9 8 9 9 0 01-4-.9L3 20l1.4-4A8.4 8.4 0 0121 11.5z" /></symbol>
      </defs>
    </svg>
  );
}
