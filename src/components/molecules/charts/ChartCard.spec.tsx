import { fireEvent, render, screen } from '@testing-library/react';
import { ChartCard } from '@/components/molecules/charts/ChartCard';

describe('ChartCard', () => {
  it('renders loading skeleton', () => {
    const { container } = render(
      <ChartCard
        title="Evolucion"
        description="Descripcion"
        chartId="chart-loading"
        loading
      >
        <div>Contenido</div>
      </ChartCard>
    );

    expect(container.querySelector('section')).toBeInTheDocument();
    expect(screen.queryByText('Evolucion')).not.toBeInTheDocument();
  });

  it('renders empty state message', () => {
    render(
      <ChartCard
        title="Evolucion"
        description="Descripcion"
        chartId="chart-empty"
        isEmpty
        emptyText="Sin datos"
      >
        <div>Contenido</div>
      </ChartCard>
    );

    expect(screen.getByText('Evolucion')).toBeInTheDocument();
    expect(screen.getByText('Sin datos')).toBeInTheDocument();
  });

  it('renders helper text and dismiss action', () => {
    const onDismiss = vi.fn();

    render(
      <ChartCard
        title="Evolucion"
        description="Descripcion"
        chartId="chart-main"
        helperText="Tip de ayuda"
        onDismissHelperText={onDismiss}
      >
        <div>Contenido principal</div>
      </ChartCard>
    );

    expect(screen.getByText('Tip de ayuda')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar ayuda' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Contenido principal')).toBeInTheDocument();
  });
});
