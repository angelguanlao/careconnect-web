import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { usePageMeta } from '../hooks/usePageMeta.js';
import {
  healthMetrics, quickAccess, recentActivity, appointments,
  greeting, firstName, todayLong, initials
} from '../data/mockData.js';

export default function Dashboard() {
  const { user } = useAuth();
  usePageMeta('Health Dashboard', 'Your personalized health overview: heart rate, steps, sleep, upcoming appointments, and recent activity.');
  return (
    <div>
      <header className="page-head">
        <div>
          <span className="eyebrow teal">{todayLong()}</span>
          <h1>{greeting()}, {firstName(user.name)}</h1>
        </div>
        <div className="head-actions">
          <Link to="/notifications" className="btn-icon btn-round" aria-label="Alerts, 3 unread">
            <Icon id="bell" size={20} />
          </Link>
          <span className="avatar md" aria-hidden="true">{initials(user.name)}</span>
        </div>
      </header>

      <section className="section" aria-labelledby="summary-h" style={{ marginTop: 0 }}>
        <h2 className="eyebrow" id="summary-h">Today's health summary</h2>
        <div className="metric-grid">
          {healthMetrics.map((m) => (
            <div className="card metric-card" key={m.label}>
              <div className="metric-top">
                <span className={`tile ${m.tile}`}><Icon id={m.icon} size={22} /></span>
                <span className={`metric-delta ${m.dir}`}>{m.delta}</span>
              </div>
              <div className="metric-value">{m.value}</div>
              <div className="metric-unit">{m.unit}</div>
              <div className="metric-label">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="dash-grid section">
        <div>
          <section aria-labelledby="quick-h">
            <h2 className="eyebrow" id="quick-h" style={{ marginBottom: 'var(--sp-2)' }}>Quick access</h2>
            <div className="quick-grid">
              {quickAccess.map((q) => (
                <Link className="quick-tile" to={q.to} key={q.label}>
                  <span className={`tile ${q.tile}`}><Icon id={q.icon} size={22} /></span>
                  <span className="label">{q.label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section aria-labelledby="activity-h" className="section">
            <h2 className="eyebrow" id="activity-h" style={{ marginBottom: 'var(--sp-2)' }}>Recent activity</h2>
            <div className="list-card">
              {recentActivity.map((a) => (
                <Link className="list-row" to={a.to} key={a.title}>
                  <span className={`tile ${a.tile}`}><Icon id={a.icon} size={20} /></span>
                  <span className="row-main">
                    <span className="row-title" style={{ display: 'block' }}>{a.title}</span>
                    <span className="row-sub">{a.sub}</span>
                  </span>
                  <span className="row-chevron"><Icon id="chevron" size={18} /></span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section aria-labelledby="appts-h">
          <h2 className="eyebrow" id="appts-h" style={{ marginBottom: 'var(--sp-2)' }}>Upcoming appointments</h2>
          <div className="list-card">
            {appointments.map((ap) => (
              <div className="appt-card" key={ap.name}>
                <span className="avatar sm" aria-hidden="true">{ap.initials}</span>
                <span className="appt-main">
                  <span className="appt-name" style={{ display: 'block' }}>{ap.name}</span>
                  <span className="appt-spec">{ap.specialty}</span>
                  <span className="appt-when"><Icon id="calendar" size={14} /> {ap.when}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
