import { render, screen } from '@testing-library/react';
import { Icon } from '@/components/atoms/icons/Icon';

describe('Icon', () => {
  it('renders icon name and aria label when provided', () => {
    render(<Icon name="dark_mode" ariaLabel="Tema oscuro" />);

    expect(screen.getByRole('img', { name: 'Tema oscuro' })).toHaveTextContent(
      'dark_mode'
    );
  });

  it('uses aria-hidden when ariaLabel is omitted', () => {
    render(<Icon name="light_mode" size="lg" />);

    const icon = screen.getByText('light_mode');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
