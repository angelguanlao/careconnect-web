import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import TagInput from '../components/TagInput.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { initials, BLOOD_GROUPS, ALLERGEN_OPTIONS } from '../data/mockData.js';

function InfoRow({ k, v }) {
  return (
    <div className="info-row">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
    </div>
  );
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  usePageMeta('Profile', 'Manage your CareConnect patient profile: personal information, contact details, and health record.');
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <ProfileEdit user={user} onSave={(patch) => { updateUser(patch); setEditing(false); toast('Profile saved', 'success'); }} onCancel={() => setEditing(false)} />;
  }

  return (
    <div>
      <header className="page-head">
        <h1>Profile</h1>
        <div className="head-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
            <Icon id="edit" size={16} /> Edit
          </button>
        </div>
      </header>

      <div className="card profile-hero">
        <span className="avatar xl" aria-hidden="true">{initials(user.name)}</span>
        <div className="p-name">{user.name}</div>
        <div className="p-sub">Patient · {user.mrn}</div>
        <div className="profile-stats">
          <div className="st"><div className="v">{user.stats.appointments}</div><div className="k">Appointments</div></div>
          <div className="st"><div className="v">{user.stats.providers}</div><div className="k">Providers</div></div>
          <div className="st"><div className="v">{user.stats.records}</div><div className="k">Records</div></div>
        </div>
      </div>

      <section className="card section" aria-labelledby="pi-h">
        <h2 className="eyebrow" id="pi-h" style={{ marginBottom: 'var(--sp-1)' }}>Personal information</h2>
        <div className="info-list">
          <InfoRow k="Full name" v={user.name} />
          <InfoRow k="Email" v={user.email} />
          <InfoRow k="Phone" v={user.phone} />
          <InfoRow k="Date of birth" v={user.dob} />
          <InfoRow k="Blood group" v={user.bloodGroup} />
          <InfoRow k="Known allergies" v={user.allergies.length ? user.allergies.join(', ') : 'None recorded'} />
        </div>
      </section>
    </div>
  );
}

function ProfileEdit({ user, onSave, onCancel }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup);
  const [allergies, setAllergies] = useState(user.allergies);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Full name is required.');
    if (!/.+@.+\..+/.test(email.trim())) return setError('Enter a valid email address.');
    setError('');
    onSave({ name: name.trim(), email: email.trim(), phone: phone.trim(), bloodGroup, allergies });
  };

  return (
    <div>
      <header className="page-head">
        <h1>Edit Profile</h1>
      </header>
      <form className="card" noValidate onSubmit={submit}>
        <div className="field">
          <label htmlFor="pf-name">Full name</label>
          <input className="input" id="pf-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="pf-email">Email</label>
          <input className="input" id="pf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="pf-phone">Phone</label>
          <input className="input" id="pf-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="pf-blood">Blood group</label>
          <select className="select" id="pf-blood" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
            {BLOOD_GROUPS.map((b) => <option value={b} key={b}>{b}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor="pf-allergy">Known allergies</label>
          <TagInput id="pf-allergy" label="Add an allergy" tags={allergies} setTags={setAllergies} suggestions={ALLERGEN_OPTIONS} />
          <div className="hint">Type an allergy and press Enter. Pick a suggestion or add your own.</div>
        </div>

        {error ? <div className="error-text" role="alert"><Icon id="error" size={16} /> {error}</div> : null}

        <div className="flex gap-2 mt-3">
          <button className="btn" type="submit">Save changes</button>
          <button className="btn btn-tertiary" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
