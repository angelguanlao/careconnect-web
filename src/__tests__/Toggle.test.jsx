import { render, screen, fireEvent } from '@testing-library/react';
import Toggle from '../components/Toggle.jsx';

function setup(overrides = {}) {
  const onChange = jest.fn();
  const props = { id: 'test-toggle', checked: false, label: 'Enable feature', onChange, ...overrides };
  render(<Toggle {...props} />);
  return { onChange, checkbox: screen.getByRole('switch') };
}

describe('Toggle', () => {
  it('renders a checkbox with role="switch"', () => {
    const { checkbox } = setup();
    expect(checkbox).toBeInTheDocument();
  });

  it('reflects checked=false via aria-checked', () => {
    const { checkbox } = setup({ checked: false });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('reflects checked=true via aria-checked', () => {
    const { checkbox } = setup({ checked: true });
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('has an accessible aria-label', () => {
    const { checkbox } = setup({ label: 'High contrast mode' });
    expect(checkbox).toHaveAttribute('aria-label', 'High contrast mode');
  });

  it('calls onChange with true when toggled on', () => {
    const { onChange, checkbox } = setup({ checked: false });
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when toggled off', () => {
    const { onChange, checkbox } = setup({ checked: true });
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('uses the supplied id on the input', () => {
    setup({ id: 'my-switch' });
    expect(document.getElementById('my-switch')).toBeInTheDocument();
  });
});
