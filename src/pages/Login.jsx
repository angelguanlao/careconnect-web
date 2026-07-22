import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    <main className="login-wrap" id="main">
      <form className="login-card" noValidate aria-labelledby="login-title" onSubmit={submit}>
        <div className="login-logo"><Icon id="heart" size={30} /></div>
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
    </main>
  );
}
