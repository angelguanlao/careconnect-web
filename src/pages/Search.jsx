import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { NAV_ITEMS, features, notifications, recentActivity } from '../data/mockData.js';

// Flat search index across navigation, features, notifications, and activity.
function buildIndex() {
  const idx = [];
  NAV_ITEMS.forEach((n) => idx.push({ section: 'Navigation', title: n.label, sub: `Go to ${n.label}`, to: n.path }));
  features.forEach((f) => idx.push({ section: 'Features', title: f.title, sub: f.desc, to: '/features' }));
  notifications.forEach((n) => idx.push({ section: 'Notifications', title: n.title, sub: n.body, to: '/notifications' }));
  recentActivity.forEach((a) => idx.push({ section: 'Recent activity', title: a.title, sub: a.sub, to: a.to }));
  return idx;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const q = query.trim().toLowerCase();
  const results = q
    ? buildIndex().filter((r) => `${r.title} ${r.sub} ${r.section}`.toLowerCase().includes(q))
    : [];

  const groups = new Map();
  results.forEach((r) => {
    if (!groups.has(r.section)) groups.set(r.section, []);
    groups.get(r.section).push(r);
  });

  return (
    <div>
      <header className="page-head"><h1>Search</h1></header>

      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="input-icon" style={{ maxWidth: 520 }}>
          <span className="lead"><Icon id="search" size={18} /></span>
          <input
            ref={inputRef}
            className="input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search features, notifications, activity…"
            aria-label="Search CareConnect"
          />
        </div>
      </form>

      <p className="muted mt-3" aria-live="polite">
        {q ? `${results.length} result${results.length === 1 ? '' : 's'} for “${query.trim()}”.` : 'Type to search across your portal.'}
      </p>

      {[...groups.entries()].map(([section, items]) => (
        <section className="section" key={section} aria-labelledby={`sec-${section}`}>
          <span className="eyebrow" id={`sec-${section}`} style={{ display: 'block', marginBottom: 'var(--sp-2)' }}>{section}</span>
          <div className="list-card">
            {items.map((r, i) => (
              <Link className="list-row" to={r.to} key={i}>
                <span className="row-main">
                  <span className="row-title" style={{ display: 'block' }}>{r.title}</span>
                  <span className="row-sub">{r.sub}</span>
                </span>
                <span className="row-chevron"><Icon id="chevron" size={18} /></span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
