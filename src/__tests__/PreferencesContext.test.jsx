import { render, screen, act } from '@testing-library/react';
import { PreferencesProvider, usePreferences } from '../context/PreferencesContext.jsx';

function Consumer() {
  const prefs = usePreferences();
  return (
    <div>
      <span data-testid="scale">{prefs.textScale}</span>
      <span data-testid="hc">{String(prefs.highContrast)}</span>
      <span data-testid="rm">{String(prefs.reduceMotion)}</span>
      <button onClick={() => prefs.setTextScale(1.5)}>Set 1.5</button>
      <button onClick={() => prefs.setTextScale(0.1)}>Set too small</button>
      <button onClick={() => prefs.setTextScale(9.9)}>Set too large</button>
      <button onClick={() => prefs.update({ highContrast: true })}>HC on</button>
      <button onClick={() => prefs.update({ reduceMotion: true })}>RM on</button>
    </div>
  );
}

function renderConsumer() {
  render(<PreferencesProvider><Consumer /></PreferencesProvider>);
}

describe('PreferencesContext', () => {
  it('starts with textScale=1', () => {
    renderConsumer();
    expect(screen.getByTestId('scale').textContent).toBe('1');
  });

  it('setTextScale updates the scale', () => {
    renderConsumer();
    act(() => screen.getByText('Set 1.5').click());
    expect(screen.getByTestId('scale').textContent).toBe('1.5');
  });

  it('setTextScale clamps at minimum (0.8)', () => {
    renderConsumer();
    act(() => screen.getByText('Set too small').click());
    expect(parseFloat(screen.getByTestId('scale').textContent)).toBeGreaterThanOrEqual(0.8);
  });

  it('setTextScale clamps at maximum (2)', () => {
    renderConsumer();
    act(() => screen.getByText('Set too large').click());
    expect(parseFloat(screen.getByTestId('scale').textContent)).toBeLessThanOrEqual(2);
  });

  it('update sets highContrast', () => {
    renderConsumer();
    act(() => screen.getByText('HC on').click());
    expect(screen.getByTestId('hc').textContent).toBe('true');
  });

  it('update sets reduceMotion', () => {
    renderConsumer();
    act(() => screen.getByText('RM on').click());
    expect(screen.getByTestId('rm').textContent).toBe('true');
  });

  it('throws when usePreferences is used outside PreferencesProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow('usePreferences must be used within PreferencesProvider');
    spy.mockRestore();
  });

  it('persists preferences to localStorage', () => {
    renderConsumer();
    act(() => screen.getByText('HC on').click());
    const stored = JSON.parse(localStorage.getItem('careconnect.prefs'));
    expect(stored.highContrast).toBe(true);
  });

  it('loads persisted preferences from localStorage on mount', () => {
    localStorage.setItem('careconnect.prefs', JSON.stringify({ textScale: 1.4 }));
    renderConsumer();
    expect(screen.getByTestId('scale').textContent).toBe('1.4');
  });
});
