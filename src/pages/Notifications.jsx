import { useMemo, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { notifications as seed } from '../data/mockData.js';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'appointments', label: 'Appointments' }
];

export default function Notifications() {
  const { announce } = useToast();
  usePageMeta('Notifications', 'Your CareConnect alerts: appointment reminders, prescription updates, lab results, and care-team messages.');
  const [items, setItems] = useState(seed);
  const [filter, setFilter] = useState('all');

  const visible = useMemo(() => items.filter((n) => {
    if (filter === 'unread') return n.unread;
    if (filter === 'appointments') return n.category === 'appointment';
    return true;
  }), [items, filter]);

  const markAllRead = () => {
    setItems((list) => list.map((n) => ({ ...n, unread: false })));
    announce('All notifications marked as read');
  };

  return (
    <div>
      <header className="page-head">
        <h1>Notifications</h1>
        <div className="head-actions">
          <button className="link-action" onClick={markAllRead}>Mark all read</button>
        </div>
      </header>

      <div className="filter-row" role="group" aria-label="Filter notifications">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className="pill"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="notif-list" style={{ listStyle: 'none' }} aria-label="Notifications">
        {visible.map((n) => (
          <li className={`notif-item ${n.unread ? 'unread' : ''}`} key={n.id}>
            <span className={`tile ${n.tile}`}><Icon id={n.icon} size={20} /></span>
            <div>
              <div className="notif-title">
                {n.title}
                {n.unread ? <span className="notif-dot" aria-label="Unread" /> : null}
              </div>
              <div className="notif-body">{n.body}</div>
            </div>
            <span className="notif-time">{n.time}</span>
          </li>
        ))}
        {!visible.length ? <li className="card muted">No notifications in this view.</li> : null}
      </ul>
    </div>
  );
}
