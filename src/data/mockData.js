// Mock content for the CareConnect patient health portal (no backend — parity
// with the Figma hi-fi mockups). In a real app this would come from an API.

export const NAV_ITEMS = [
  { screen: 'home', path: '/', label: 'Home', icon: 'home' },
  { screen: 'features', path: '/features', label: 'Features', icon: 'list' },
  { screen: 'alerts', path: '/notifications', label: 'Alerts', icon: 'bell', badge: 3 },
  { screen: 'profile', path: '/profile', label: 'Profile', icon: 'user' },
  { screen: 'settings', path: '/settings', label: 'Settings', icon: 'gear' }
];

// Dashboard — today's health summary
export const healthMetrics = [
  { icon: 'heart', tile: 'rose', value: '72', unit: 'bpm', label: 'Heart Rate', delta: '+2 bpm', dir: 'up' },
  { icon: 'activity', tile: 'teal', value: '8,431', unit: 'today', label: 'Steps', delta: '+14%', dir: 'up' },
  { icon: 'clock', tile: 'amber', value: '7.2', unit: 'hrs', label: 'Sleep', delta: '−0.3h', dir: 'down' }
];

export const quickAccess = [
  { icon: 'file', tile: 'blue', label: 'Lab Results', to: '/features' },
  { icon: 'pill', tile: 'amber', label: 'Prescriptions', to: '/features' },
  { icon: 'message', tile: 'slate', label: 'Messages', to: '/notifications' },
  { icon: 'warn', tile: 'rose', label: 'Emergency', to: '/features' }
];

export const recentActivity = [
  { icon: 'file', tile: 'blue', title: 'Lab results available', sub: 'CBC Panel · Jul 15', to: '/notifications' },
  { icon: 'pill', tile: 'amber', title: 'Prescription ready for pickup', sub: 'Lisinopril 10mg · CVS Pharmacy', to: '/notifications' },
  { icon: 'check-circle', tile: 'teal', title: 'Appointment confirmed', sub: 'Dr. Patel · Jul 20', to: '/notifications' }
];

export const appointments = [
  { initials: 'MP', name: 'Dr. Maya Patel', specialty: 'Cardiologist', when: 'Thu, 20 Jul · 2:30 PM' },
  { initials: 'JT', name: 'Dr. James Torres', specialty: 'General Practice', when: 'Mon, 24 Jul · 10:00 AM' }
];

// Features
export const features = [
  { icon: 'video', tile: 'teal', title: 'Telemedicine', desc: 'Video consultations with your care team, available 24/7', badge: 'Popular', badgeKind: 'soft' },
  { icon: 'pill', tile: 'amber', title: 'Prescriptions', desc: 'Request refills, manage medications, and set reminders' },
  { icon: 'file', tile: 'blue', title: 'Lab Results', desc: 'View, download, and share your test results securely', badge: '3 new', badgeKind: 'info' },
  { icon: 'shield', tile: 'slate', title: 'Health Records', desc: 'Access your complete, HIPAA-compliant medical history' },
  { icon: 'users', tile: 'teal', title: 'Care Team', desc: 'Connect with providers, specialists, and care coordinators' },
  { icon: 'warn', tile: 'rose', title: 'Emergency', desc: 'One-tap emergency contacts and location-based alerts' }
];

// Notifications / Alerts
export const notifications = [
  { id: 1, category: 'appointment', icon: 'calendar', tile: 'teal', unread: true, title: 'Appointment reminder', body: 'Dr. Maya Patel · Cardiology · Tomorrow at 2:30 PM', time: '2h ago' },
  { id: 2, category: 'prescription', icon: 'pill', tile: 'amber', unread: true, title: 'Prescription ready', body: 'Lisinopril 10mg is ready for pickup at CVS Pharmacy on Oak St.', time: '5h ago' },
  { id: 3, category: 'lab', icon: 'file', tile: 'blue', unread: false, title: 'Lab results available', body: 'Your CBC Panel results from Jul 15 are now available to view.', time: '1d ago' },
  { id: 4, category: 'message', icon: 'message', tile: 'slate', unread: false, title: 'Message from care team', body: 'Dr. Torres sent you a message regarding your last visit notes.', time: '2d ago' },
  { id: 5, category: 'appointment', icon: 'check-circle', tile: 'teal', unread: false, title: 'Appointment confirmed', body: 'Your visit with Dr. James Torres on Jul 24 at 10:00 AM is confirmed.', time: '3d ago' }
];

export const BLOOD_GROUPS = ['O+', 'O−', 'A+', 'A−', 'B+', 'B−', 'AB+', 'AB−'];
export const ALLERGEN_OPTIONS = ['Penicillin', 'Latex', 'Peanuts', 'Aspirin', 'Sulfa drugs', 'Iodine', 'Shellfish'];

export const defaultUser = {
  name: 'Sarah Chen',
  mrn: 'MRN-00418-CC',
  email: 'sarah.chen@careconnect.health',
  phone: '+1 (415) 555-0182',
  dob: 'March 12, 1990',
  bloodGroup: 'O+',
  allergies: ['Penicillin', 'Latex'],
  stats: { appointments: 12, providers: 4, records: 38 }
};

const BADGE = {
  success: { icon: 'check', label: 'success' },
  warning: { icon: 'warn', label: 'warning' },
  error: { icon: 'error', label: 'error' },
  info: { icon: 'info', label: 'info' }
};
export const badgeMeta = (status) => BADGE[status] || BADGE.info;

export function initials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}
export function firstName(name) {
  return (name || '').trim().split(/\s+/)[0] || name;
}
export function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}
export function todayLong() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).format(new Date()).toUpperCase();
}
