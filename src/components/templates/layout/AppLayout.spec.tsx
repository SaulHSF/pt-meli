import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppLayout } from '@/components/templates/layout/AppLayout';

describe('AppLayout', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('renders route title/subtitle and content', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppLayout>
          <div>Contenido principal</div>
        </AppLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('Reporte de Adopción de Herramientas')).toBeInTheDocument();
    expect(screen.getByText('Métricas de uso por equipo')).toBeInTheDocument();
    expect(screen.getByText('Contenido principal')).toBeInTheDocument();
  });

  it('updates document theme and localStorage on theme change', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppLayout>
          <div>Contenido principal</div>
        </AppLayout>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Tema Oscuro' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('app-theme')).toBe('dark');
  });
});
