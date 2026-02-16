import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { EvolutionChart } from '@/components/organisms/charts/EvolutionChart';

vi.mock('@/components/atoms/charts/BaseBarChart', () => ({
  BaseBarChart: () => <div data-testid="base-bar-chart">MockedChart</div>,
}));

describe('EvolutionChart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders empty state when there is no data', () => {
    render(<EvolutionChart data={[]} title="Evolucion herramientas" />);

    expect(screen.getByText('Evolucion herramientas')).toBeInTheDocument();
    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });

  it('renders helper tip and allows dismissing it', async () => {
    render(
      <EvolutionChart
        title="Evolucion herramientas"
        data={[{ month: 'Ene 2024', noUse: 1, low: 2, frequent: 3, daily: 4 }]}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText('Tip: haz clic en la leyenda para ocultar o mostrar series.')
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar ayuda' }));

    await waitFor(() => {
      expect(
        screen.queryByText('Tip: haz clic en la leyenda para ocultar o mostrar series.')
      ).not.toBeInTheDocument();
    });

    expect(localStorage.getItem('evolution-chart-legend-tip-dismissed')).toBe('true');
  });
});
