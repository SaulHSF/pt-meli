import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeDropdown } from '@/components/atoms/theme/ThemeDropdown';
import type { ThemeMode } from '@/components/atoms/theme/ThemeDropdown';
import { getRouteMeta } from '@/routes/routeMeta';

interface AppLayoutProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = 'app-theme';

function resolveDefaultTheme(): ThemeMode {
  if (globalThis.matchMedia?.('(prefers-contrast: more)').matches) {
    return 'high-contrast';
  }

  if (globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

function resolveInitialTheme(): ThemeMode {
  try {
    const savedTheme = globalThis.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'high-contrast') {
      return savedTheme;
    }
  } catch {
    // no-op if storage is unavailable
  }

  return resolveDefaultTheme();
}

function applyTheme(theme: ThemeMode) {
  const root = globalThis.document.documentElement;

  if (theme === 'light') {
    delete root.dataset.theme;
    return;
  }

  root.dataset.theme = theme;
}

export function AppLayout({ children }: Readonly<AppLayoutProps>) {
  const { pathname } = useLocation();
  const { title, subtitle } = getRouteMeta(pathname);
  const [theme, setTheme] = useState<ThemeMode>(() => resolveInitialTheme());

  useEffect(() => {
    applyTheme(theme);
    try {
      globalThis.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // no-op if storage is unavailable
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] antialiased">
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/90 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg-card)]/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
              Reporte inteligente de adopción
            </p>
            <h1 className="text-xl font-semibold leading-tight lg:text-2xl">{title}</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
          </div>

          <div className="inline-flex items-center gap-2 self-start text-sm text-[var(--color-text-secondary)]">
            <ThemeDropdown value={theme} onChange={setTheme} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:py-10">{children}</main>
    </div>
  );
}
