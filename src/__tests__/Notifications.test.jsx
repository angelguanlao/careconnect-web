import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils.jsx';
import Notifications from '../pages/Notifications.jsx';

describe('Notifications page', () => {
  beforeEach(() => renderWithProviders(<Notifications />));

  it('renders the Notifications heading', () => {
    expect(screen.getByRole('heading', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('renders the All, Unread, Appointments filter buttons', () => {
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unread' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Appointments' })).toBeInTheDocument();
  });

  it('renders the notifications list', () => {
    expect(screen.getByRole('list', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('renders all 5 notifications in the All view', () => {
    const items = screen.getAllByRole('listitem');
    // 5 notifications
    expect(items.length).toBeGreaterThanOrEqual(5);
  });

  it('filters to unread only when Unread is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Unread' }));
    // seed has 2 unread notifications
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(2);
  });

  it('filters to appointments when Appointments is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Appointments' }));
    expect(screen.getByText('Appointment reminder')).toBeInTheDocument();
    expect(screen.queryByText('Prescription ready')).not.toBeInTheDocument();
  });

  it('Mark all read button is present', () => {
    expect(screen.getByRole('button', { name: 'Mark all read' })).toBeInTheDocument();
  });

  it('Mark all read removes the Unread filter results', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Mark all read' }));
    fireEvent.click(screen.getByRole('button', { name: 'Unread' }));
    expect(screen.getByText('No notifications in this view.')).toBeInTheDocument();
  });
});
