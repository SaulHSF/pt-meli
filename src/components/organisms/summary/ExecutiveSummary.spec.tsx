import { render, screen } from '@testing-library/react';
import { ExecutiveSummary } from '@/components/organisms/summary/ExecutiveSummary';

const metrics = {
  teamSize: 12,
  dailyCount: 3,
  dailyPercent: 25,
  noUseCount: 2,
  noUsePercent: 17,
  lowCount: 4,
  lowPercent: 33,
  frequentCount: 3,
  frequentPercent: 25,
};

describe('ExecutiveSummary', () => {
  it('returns null when metrics are not available', () => {
    const { container } = render(<ExecutiveSummary metrics={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders loading state', () => {
    render(<ExecutiveSummary metrics={metrics} loading />);
    expect(screen.getByLabelText('Resumen ejecutivo')).toBeInTheDocument();
  });

  it('renders metric cards content', () => {
    render(<ExecutiveSummary metrics={metrics} />);

    expect(screen.getByText('Resumen ejecutivo')).toBeInTheDocument();
    expect(screen.getByText('Tamaño del equipo')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getAllByText('3 (25%)')).toHaveLength(2);
    expect(screen.getByText('2 (17%)')).toBeInTheDocument();
  });
});
