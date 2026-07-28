import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils.jsx';
import Dashboard from '../pages/Dashboard.jsx';

describe('Dashboard page', () => {
  beforeEach(() => renderWithProviders(<Dashboard />));

  it('renders the h1 heading', () => {
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('includes the user first name in the heading', () => {
    // defaultUser.name = 'Sarah Chen' → firstName = 'Sarah'
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sarah');
  });

  it("renders Today's health summary section", () => {
    expect(screen.getByText("Today's health summary")).toBeInTheDocument();
  });

  it('renders all three health metrics', () => {
    expect(screen.getByText('Heart Rate')).toBeInTheDocument();
    expect(screen.getByText('Steps')).toBeInTheDocument();
    expect(screen.getByText('Sleep')).toBeInTheDocument();
  });

  it('renders upcoming appointments section', () => {
    expect(screen.getByText('Upcoming appointments')).toBeInTheDocument();
  });

  it('renders at least one appointment', () => {
    expect(screen.getByText('Dr. Maya Patel')).toBeInTheDocument();
  });

  it('renders quick access section', () => {
    expect(screen.getByText('Quick access')).toBeInTheDocument();
  });

  it('renders recent activity section', () => {
    expect(screen.getByText('Recent activity')).toBeInTheDocument();
  });

  it('renders the alerts link', () => {
    expect(screen.getByLabelText('Alerts, 3 unread')).toBeInTheDocument();
  });
});
