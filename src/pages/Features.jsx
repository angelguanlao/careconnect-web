import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { features } from '../data/mockData.js';

export default function Features() {
  usePageMeta('Features', 'Explore CareConnect features: telemedicine, prescriptions, lab results, health records, care team, and emergency.');
  return (
    <div>
      <header className="page-head">
        <h1>Features</h1>
        <div className="head-actions">
          <Link to="/search" className="btn-icon btn-round" aria-label="Search features">
            <Icon id="search" size={20} />
          </Link>
        </div>
      </header>

      <ul className="feature-grid" style={{ listStyle: 'none' }} aria-label="Available features">
        {features.map((f) => (
          <li className="card feature-card" key={f.title}>
            <div className="feature-top">
              <span className={`tile ${f.tile}`}><Icon id={f.icon} size={22} /></span>
              {f.badge ? <span className={`badge badge-${f.badgeKind}`}>{f.badge}</span> : null}
            </div>
            <h2 className="feature-title">{f.title}</h2>
            <p className="feature-desc">{f.desc}</p>
            <Link className="link-action" to="/search" aria-label={`Open ${f.title}`}>
              Open <Icon id="chevron" size={16} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
