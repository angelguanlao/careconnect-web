import { render, screen, act, waitFor } from '@testing-library/react';
import { ToastProvider, useToast } from '../context/ToastContext.jsx';

function ToastConsumer({ kind }) {
  const { toast, announce } = useToast();
  return (
    <div>
      <button onClick={() => toast('Saved successfully', kind || 'success')}>Show Toast</button>
      <button onClick={() => toast('Something broke', 'error')}>Show Error</button>
      <button onClick={() => toast('FYI', 'info')}>Show Info</button>
      <button onClick={() => toast('Watch out', 'warn')}>Show Warn</button>
      <button onClick={() => announce('Profile screen')}>Announce</button>
    </div>
  );
}

function renderConsumer(kind) {
  render(<ToastProvider><ToastConsumer kind={kind} /></ToastProvider>);
}

describe('ToastContext', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows a success toast message', () => {
    renderConsumer();
    act(() => screen.getByText('Show Toast').click());
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
  });

  it('shows an error toast', () => {
    renderConsumer();
    act(() => screen.getByText('Show Error').click());
    expect(screen.getByText('Something broke')).toBeInTheDocument();
  });

  it('shows an info toast', () => {
    renderConsumer();
    act(() => screen.getByText('Show Info').click());
    expect(screen.getByText('FYI')).toBeInTheDocument();
  });

  it('shows a warn toast', () => {
    renderConsumer();
    act(() => screen.getByText('Show Warn').click());
    expect(screen.getByText('Watch out')).toBeInTheDocument();
  });

  it('toast disappears after 4 seconds', () => {
    renderConsumer();
    act(() => screen.getByText('Show Toast').click());
    // The visible toast banner uses role="status" and has a className "toast …"
    expect(document.querySelector('.toast')).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(4001));
    expect(document.querySelector('.toast')).not.toBeInTheDocument();
  });

  it('announce populates the aria-live region', async () => {
    renderConsumer();
    act(() => screen.getByText('Announce').click());
    await waitFor(() => {
      expect(screen.getByRole('status', { hidden: true })).toHaveTextContent('Profile screen');
    });
  });

  it('throws when useToast is used outside ToastProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ToastConsumer />)).toThrow('useToast must be used within ToastProvider');
    spy.mockRestore();
  });
});
