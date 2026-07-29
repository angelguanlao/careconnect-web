import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils.jsx';
import Search from '../pages/Search.jsx';

describe('Search page', () => {
  it('renders the Search heading', () => {
    renderWithProviders(<Search />);
    expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders the search input', () => {
    renderWithProviders(<Search />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('shows the empty-state hint when query is blank', () => {
    renderWithProviders(<Search />);
    expect(screen.getByText('Type to search across your portal.')).toBeInTheDocument();
  });

  it('shows result count after typing a query', async () => {
    renderWithProviders(<Search />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'lab' } });
    expect(await screen.findByText(/\d+ results? for/i)).toBeInTheDocument();
  });

  it('renders grouped result sections for a matching query', () => {
    renderWithProviders(<Search />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'lab' } });
    // "Lab Results" appears in Features and Notifications sections
    expect(screen.getAllByText('Lab results available').length).toBeGreaterThan(0);
  });

  it('shows 0 results for a query with no matches', () => {
    renderWithProviders(<Search />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzznomatch' } });
    expect(screen.getByText(/0 results/i)).toBeInTheDocument();
  });

  it('searches navigation items', () => {
    renderWithProviders(<Search />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'home' } });
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });
});
