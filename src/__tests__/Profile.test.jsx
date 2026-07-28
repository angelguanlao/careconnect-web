import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils.jsx';
import Profile from '../pages/Profile.jsx';

describe('Profile page — view mode', () => {
  beforeEach(() => renderWithProviders(<Profile />));

  it('renders the Profile heading', () => {
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
  });

  it('shows the default user name', () => {
    // Name appears in both the hero card and the info row — just confirm it's present
    expect(screen.getAllByText('Sarah Chen').length).toBeGreaterThanOrEqual(1);
  });

  it('shows the MRN', () => {
    expect(screen.getByText(/MRN-00418-CC/)).toBeInTheDocument();
  });

  it('shows personal information section', () => {
    expect(screen.getByText('Personal information')).toBeInTheDocument();
  });

  it('shows the user email', () => {
    expect(screen.getByText('sarah.chen@careconnect.health')).toBeInTheDocument();
  });

  it('shows blood group', () => {
    expect(screen.getByText('O+')).toBeInTheDocument();
  });

  it('shows known allergies', () => {
    expect(screen.getByText('Penicillin, Latex')).toBeInTheDocument();
  });

  it('shows the Edit button', () => {
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });
});

describe('Profile page — edit mode', () => {
  beforeEach(() => {
    renderWithProviders(<Profile />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
  });

  it('switches to edit mode showing Edit Profile heading', () => {
    expect(screen.getByRole('heading', { name: 'Edit Profile' })).toBeInTheDocument();
  });

  it('renders the full name input pre-filled', () => {
    expect(screen.getByLabelText('Full name')).toHaveValue('Sarah Chen');
  });

  it('renders the email input pre-filled', () => {
    expect(screen.getByLabelText('Email')).toHaveValue('sarah.chen@careconnect.health');
  });

  it('renders the blood group select', () => {
    expect(screen.getByLabelText('Blood group')).toBeInTheDocument();
  });

  it('shows validation error when name is cleared', () => {
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Full name is required.');
  });

  it('shows validation error for invalid email', () => {
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'bademail' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.');
  });

  it('Cancel returns to view mode', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
  });

  it('Save changes with valid data returns to view mode', () => {
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getAllByText('Jane Doe').length).toBeGreaterThanOrEqual(1);
  });
});
