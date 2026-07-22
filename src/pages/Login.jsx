import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { usePageMeta } from '../hooks/usePageMeta.js';

export default function Login() {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  usePageMeta('Sign In', 'Sign in to your CareConnect health dashboard to manage appointments, prescriptions, and records.');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('careconnect.rememberEmail');
    if (saved) { setEmail(saved); setRemember(true); }
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email)) return setError('Enter a valid email address.');
    if (!password) return setError('Password is required.');
    setError('');
    signIn(email.trim(), remember); // demo auth
    navigate('/');
  };

  return (
    <main className="login-page" id="main">
      <div className="login-shell">
        <aside className="login-brand" aria-label="About CareConnect">
          <span className="logo"><Icon id="heart" size={26} /></span>
          <span className="brand-name">CareConnect</span>
          <h2>Your health, connected.</h2>
          <p className="tagline">Appointments, prescriptions, lab results, and your care team — all in one accessible place.</p>
          <figure className="testimonial">
            <div className="stars" aria-hidden="true">★★★★★</div>
            <p>"CareConnect keeps my whole family's care organized — a caring companion, every step of the way."</p>
            <cite>— Jordan M., CareConnect member</cite>
          </figure>
        </aside>

        <div className="login-form-col">
          <form className="login-card" noValidate aria-labelledby="login-title" onSubmit={submit}>
        <div className="login-logo"><Icon id="heart" size={26} /></div>
        <h1 id="login-title">Welcome back</h1>
        <p className="login-sub">Sign in to your health dashboard</p>

        <div className="field">
          <label htmlFor="email">Email address</label>
          <div className="input-icon">
            <span className="lead"><Icon id="mail" size={18} /></span>
            <input
              className="input" id="email" type="email" autoComplete="username"
              placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
        </div>

        <div className="field">
          <div className="login-label-row">
            <label htmlFor="password">Password</label>
            <a href="#" onClick={(e) => { e.preventDefault(); toast('Password reset link sent (demo)', 'info'); }}>Forgot password?</a>
          </div>
          <div className="input-icon">
            <span className="lead"><Icon id="lock" size={18} /></span>
            <input
              className="input has-suffix" id="password" type={showPw ? 'text' : 'password'}
              autoComplete="current-password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
            <button
              type="button" className="btn-icon suffix"
              aria-label={showPw ? 'Hide password' : 'Show password'} aria-pressed={showPw}
              onClick={() => setShowPw((s) => !s)}
            >
              <Icon id="eye" size={20} />
            </button>
          </div>
        </div>

        <div className="login-row">
          <label className="check-row">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember this device
          </label>
        </div>

        {error ? (
          <div className="error-text" role="alert"><Icon id="error" size={16} /> {error}</div>
        ) : null}

        <button className="btn btn-lg btn-block" type="submit">Sign in</button>

        <p className="login-foot">
          Need access? <a href="#" onClick={(e) => { e.preventDefault(); toast('Contact request sent to your care team (demo)', 'info'); }}>Contact your care team</a>
        </p>
          </form>
        </div>
      </div>
    </main>
  );
}
