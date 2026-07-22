import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';

// Two PWA affordances:
//  1. Install prompt — captured from beforeinstallprompt, shown as an
//     "Install app" banner (Add to Home Screen).
//  2. Update prompt — when the service worker reports a new version waiting,
//     offer a Refresh that activates it.
export default function PwaBanner() {
  const [installEvent, setInstallEvent] = useState(null);
  const [updateReg, setUpdateReg] = useState(null);

  useEffect(() => {
    const onInstall = (e) => { e.preventDefault(); setInstallEvent(e); };
    const onUpdate = (e) => setUpdateReg(e.detail);
    window.addEventListener('beforeinstallprompt', onInstall);
    window.addEventListener('sw-update-ready', onUpdate);
    return () => {
      window.removeEventListener('beforeinstallprompt', onInstall);
      window.removeEventListener('sw-update-ready', onUpdate);
    };
  }, []);

  const install = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  const refresh = () => {
    updateReg?.waiting?.postMessage('SKIP_WAITING');
    window.location.reload();
  };

  if (updateReg) {
    return (
      <div className="pwa-banner" role="status">
        <Icon id="info" size={20} />
        <span className="msg"><strong>Update available</strong><span>A new version of CareConnect is ready.</span></span>
        <button className="btn btn-sm" onClick={refresh}>Refresh</button>
        <button className="btn-icon" aria-label="Dismiss" onClick={() => setUpdateReg(null)}><Icon id="x" size={20} /></button>
      </div>
    );
  }

  if (installEvent) {
    return (
      <div className="pwa-banner" role="status">
        <Icon id="heart" size={20} />
        <span className="msg"><strong>Install CareConnect</strong><span>Add it to your home screen for quick, offline access.</span></span>
        <button className="btn btn-sm" onClick={install}>Install app</button>
        <button className="btn-icon" aria-label="Dismiss" onClick={() => setInstallEvent(null)}><Icon id="x" size={20} /></button>
      </div>
    );
  }

  return null;
}
