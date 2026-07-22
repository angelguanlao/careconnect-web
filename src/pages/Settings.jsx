import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Toggle from '../components/Toggle.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { usePageMeta } from '../hooks/usePageMeta.js';

function Row({ title, desc, children }) {
  return (
    <div className="setting-row">
      <div>
        <div className="label" style={{ marginBottom: desc ? 2 : 0 }}>{title}</div>
        {desc ? <div className="setting-desc">{desc}</div> : null}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const prefs = usePreferences();
  const { signOut } = useAuth();
  const { announce, toast } = useToast();
  const navigate = useNavigate();
  usePageMeta('Settings', 'Accessibility, notification, and account settings for your CareConnect health portal.');
  const px = Math.round(16 * prefs.textScale);

  const signOutNow = () => { signOut(); navigate('/login'); };

  return (
    <div>
      <header className="page-head"><h1>Settings</h1></header>

      <section className="card settings-group" aria-labelledby="acc-h">
        <h2 className="eyebrow" id="acc-h">Accessibility</h2>

        <div className="setting-col">
          <div className="label">Text size — {px}px</div>
          <div className="slider-row mt-2">
            <button className="btn-icon" aria-label="Decrease text size" onClick={() => prefs.setTextScale(prefs.textScale - 0.1)}><Icon id="minus" size={18} /></button>
            <input
              className="slider" type="range" min="0.8" max="2" step="0.1"
              value={prefs.textScale} aria-label="Text size"
              aria-valuetext={`${px} pixels`}
              onChange={(e) => prefs.setTextScale(parseFloat(e.target.value))}
            />
            <button className="btn-icon" aria-label="Increase text size" onClick={() => prefs.setTextScale(prefs.textScale + 0.1)}><Icon id="plus" size={18} /></button>
          </div>
          <p className="setting-desc mt-2"><em>Preview: Your appointment is on Thursday.</em></p>
        </div>

        <Row title="High contrast mode" desc="Maximum contrast palette for low vision.">
          <Toggle id="opt-hc" checked={prefs.highContrast} label="High contrast mode"
            onChange={(on) => { prefs.update({ highContrast: on }); announce(`High contrast ${on ? 'on' : 'off'}`); }} />
        </Row>
        <Row title="Reduce motion" desc="Minimize animations and transitions.">
          <Toggle id="opt-rm" checked={prefs.reduceMotion} label="Reduce motion"
            onChange={(on) => { prefs.update({ reduceMotion: on }); announce(`Reduce motion ${on ? 'on' : 'off'}`); }} />
        </Row>
        <Row title="Screen reader optimizations" desc="Wider text spacing and extra announcements.">
          <Toggle id="opt-sr" checked={!!prefs.textSpacing} label="Screen reader optimizations"
            onChange={(on) => { prefs.update({ textSpacing: on }); announce(`Screen reader optimizations ${on ? 'on' : 'off'}`); }} />
        </Row>
      </section>

      <section className="card settings-group" aria-labelledby="notif-h">
        <h2 className="eyebrow" id="notif-h">Notifications</h2>
        <Row title="Push notifications" desc="Appointment and prescription alerts on this device.">
          <Toggle id="opt-push" checked={prefs.pushNotifications ?? true} label="Push notifications"
            onChange={(on) => { prefs.update({ pushNotifications: on }); announce(`Push notifications ${on ? 'on' : 'off'}`); }} />
        </Row>
        <Row title="Email notifications" desc="Receive a daily care digest by email.">
          <Toggle id="opt-email" checked={prefs.emailNotifications ?? true} label="Email notifications"
            onChange={(on) => { prefs.update({ emailNotifications: on }); announce(`Email notifications ${on ? 'on' : 'off'}`); }} />
        </Row>
      </section>

      <section className="card settings-group" aria-labelledby="acct-h">
        <h2 className="eyebrow" id="acct-h">Account</h2>
        <div className="setting-col">
          <label className="label" htmlFor="set-lang">Language</label>
          <select className="select mt-2" id="set-lang" defaultValue="en" onChange={() => toast('Language preference saved (demo)', 'info')} style={{ maxWidth: 280 }}>
            <option value="en">English (United States)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <Row title="Sign out" desc="End your session on this device.">
          <button className="btn btn-tertiary btn-sm" onClick={signOutNow}>Sign out</button>
        </Row>
      </section>
    </div>
  );
}
