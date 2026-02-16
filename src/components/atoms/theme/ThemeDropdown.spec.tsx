import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeDropdown } from '@/components/atoms/theme/ThemeDropdown';
import type { ThemeMode } from '@/components/atoms/theme/ThemeDropdown';

describe('ThemeDropdown', () => {
  it('shows selected theme in summary aria-label', () => {
    const onChange = vi.fn<(theme: ThemeMode) => void>();
    const { container } = render(<ThemeDropdown value="light" onChange={onChange} />);

    expect(container.querySelector('summary[aria-label="Tema Claro"]')).toBeInTheDocument();
  });

  it('calls onChange with selected option', () => {
    const onChange = vi.fn<(theme: ThemeMode) => void>();
    render(<ThemeDropdown value="light" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Tema Oscuro' }));

    expect(onChange).toHaveBeenCalledWith('dark');
  });
});
