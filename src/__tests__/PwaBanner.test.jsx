import { render, screen, fireEvent, act } from '@testing-library/react';
import PwaBanner from '../components/PwaBanner.jsx';

describe('PwaBanner', () => {
  it('renders nothing when no events have fired', () => {
    const { container } = render(<PwaBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('shows the install banner when beforeinstallprompt fires', () => {
    render(<PwaBanner />);
    const promptEvent = { preventDefault: jest.fn(), prompt: jest.fn(), userChoice: Promise.resolve() };
    act(() => { window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), promptEvent)); });
    expect(screen.getByText('Install CareConnect')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Install app' })).toBeInTheDocument();
  });

  it('dismisses the install banner', () => {
    render(<PwaBanner />);
    const promptEvent = { preventDefault: jest.fn(), prompt: jest.fn(), userChoice: Promise.resolve() };
    act(() => { window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), promptEvent)); });
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(screen.queryByText('Install CareConnect')).not.toBeInTheDocument();
  });

  it('calls prompt() when Install app is clicked', async () => {
    render(<PwaBanner />);
    const promptEvent = { preventDefault: jest.fn(), prompt: jest.fn(), userChoice: Promise.resolve({ outcome: 'accepted' }) };
    act(() => { window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), promptEvent)); });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Install app' })); });
    expect(promptEvent.prompt).toHaveBeenCalled();
  });

  it('shows the update banner when sw-update-ready fires', () => {
    render(<PwaBanner />);
    const reg = { waiting: { postMessage: jest.fn() } };
    act(() => { window.dispatchEvent(new CustomEvent('sw-update-ready', { detail: reg })); });
    expect(screen.getByText('Update available')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
  });

  it('dismisses the update banner', () => {
    render(<PwaBanner />);
    const reg = { waiting: { postMessage: jest.fn() } };
    act(() => { window.dispatchEvent(new CustomEvent('sw-update-ready', { detail: reg })); });
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(screen.queryByText('Update available')).not.toBeInTheDocument();
  });

  it('posts SKIP_WAITING and reloads on Refresh', () => {
    const reload = jest.fn();
    Object.defineProperty(window, 'location', { value: { reload }, writable: true });
    render(<PwaBanner />);
    const reg = { waiting: { postMessage: jest.fn() } };
    act(() => { window.dispatchEvent(new CustomEvent('sw-update-ready', { detail: reg })); });
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(reg.waiting.postMessage).toHaveBeenCalledWith('SKIP_WAITING');
    expect(reload).toHaveBeenCalled();
  });

  it('Escape key dismisses the install banner', () => {
    render(<PwaBanner />);
    const promptEvent = { preventDefault: jest.fn(), prompt: jest.fn(), userChoice: Promise.resolve() };
    act(() => { window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), promptEvent)); });
    expect(screen.getByText('Install CareConnect')).toBeInTheDocument();
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    expect(screen.queryByText('Install CareConnect')).not.toBeInTheDocument();
  });

  it('Escape key dismisses the update banner', () => {
    render(<PwaBanner />);
    const reg = { waiting: { postMessage: jest.fn() } };
    act(() => { window.dispatchEvent(new CustomEvent('sw-update-ready', { detail: reg })); });
    expect(screen.getByText('Update available')).toBeInTheDocument();
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    expect(screen.queryByText('Update available')).not.toBeInTheDocument();
  });
});
