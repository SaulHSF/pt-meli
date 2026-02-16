import { render, screen } from '@testing-library/react';
import { UsageByToolChart } from '@/components/organisms/charts/UsageByToolChart';

vi.mock('@/components/atoms/charts/BaseBarChart', () => ({
  BaseBarChart: () => <div data-testid="base-bar-chart">MockedChart</div>,
}));

describe('UsageByToolChart', () => {
  it('renders empty state when data is empty', () => {
    render(<UsageByToolChart data={[]} title="Uso por herramienta" />);

    expect(screen.getByText('Uso por herramienta')).toBeInTheDocument();
    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });

  it('renders chart when data is provided', () => {
    render(
      <UsageByToolChart
        title="Uso por herramienta"
        data={[
          { tool: 'Windsurf', totalUsers: 10, withUse: 5 },
          { tool: 'Cursor', totalUsers: 10, withUse: 7 },
        ]}
      />
    );

    expect(screen.getByTestId('base-bar-chart')).toBeInTheDocument();
  });
});
