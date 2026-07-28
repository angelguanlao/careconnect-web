import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils.jsx';
import Features from '../pages/Features.jsx';

describe('Features page', () => {
  beforeEach(() => renderWithProviders(<Features />));

  it('renders the Features heading', () => {
    expect(screen.getByRole('heading', { name: 'Features' })).toBeInTheDocument();
  });

  it('renders the available features list', () => {
    expect(screen.getByRole('list', { name: 'Available features' })).toBeInTheDocument();
  });

  it('renders Telemedicine feature', () => {
    expect(screen.getByText('Telemedicine')).toBeInTheDocument();
  });

  it('renders Prescriptions feature', () => {
    expect(screen.getByText('Prescriptions')).toBeInTheDocument();
  });

  it('renders Lab Results feature', () => {
    expect(screen.getByText('Lab Results')).toBeInTheDocument();
  });

  it('renders Health Records feature', () => {
    expect(screen.getByText('Health Records')).toBeInTheDocument();
  });

  it('renders an Open link for each feature', () => {
    const links = screen.getAllByRole('link', { name: /Open/i });
    expect(links.length).toBe(6);
  });

  it('renders the search features button', () => {
    expect(screen.getByLabelText('Search features')).toBeInTheDocument();
  });

  it('renders the Popular badge on Telemedicine', () => {
    expect(screen.getByText('Popular')).toBeInTheDocument();
  });
});
