import { render, screen } from '@testing-library/react';
import Icon from '../components/Icon.jsx';

describe('Icon', () => {
  it('renders an svg element', () => {
    const { container } = render(<Icon id="heart" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('is decorative by default (aria-hidden=true)', () => {
    const { container } = render(<Icon id="heart" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the supplied size', () => {
    const { container } = render(<Icon id="heart" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('uses role="img" when a title is provided', () => {
    const { container } = render(<Icon id="heart" title="Heart icon" />);
    expect(container.querySelector('svg')).toHaveAttribute('role', 'img');
  });

  it('removes aria-hidden when a title is provided', () => {
    const { container } = render(<Icon id="heart" title="Heart icon" />);
    expect(container.querySelector('svg')).not.toHaveAttribute('aria-hidden');
  });

  it('renders a <title> element with the supplied title text', () => {
    const { container } = render(<Icon id="heart" title="Heart icon" />);
    expect(container.querySelector('title')).toHaveTextContent('Heart icon');
  });

  it('does not render a <title> element when no title is provided', () => {
    const { container } = render(<Icon id="heart" />);
    expect(container.querySelector('title')).not.toBeInTheDocument();
  });
});
