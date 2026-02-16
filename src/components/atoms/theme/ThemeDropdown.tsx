import { useRef } from 'react';
import { Icon } from '@/components/atoms/icons/Icon';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

interface ThemeDropdownProps {
  value: ThemeMode;
  onChange: (theme: ThemeMode) => void;
}

interface ThemeOption {
  value: ThemeMode;
  label: string;
  icon: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Claro', icon: 'light_mode' },
  { value: 'dark', label: 'Oscuro', icon: 'dark_mode' },
  { value: 'high-contrast', label: 'Alto contraste', icon: 'contrast' },
];

export function ThemeDropdown({ value, onChange }: Readonly<ThemeDropdownProps>) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const selectedOption = THEME_OPTIONS.find((option) => option.value === value) ?? THEME_OPTIONS[0];

  const handleSelect = (nextTheme: ThemeMode) => {
    onChange(nextTheme);
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  return (
    <details ref={detailsRef} className="relative">
      <summary
        className="list-none cursor-pointer rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] text-sm text-[var(--color-text-primary)]"
        aria-label={`Tema ${selectedOption.label}`}
      >
        <span className="inline-flex items-center gap-1.5 m-2">
          <Icon name={selectedOption.icon} size="sm" />
        </span>
      </summary>

      <div className="absolute right-0 z-20 mt-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-1 shadow-lg">
        {THEME_OPTIONS.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              aria-label={`Tema ${option.label}`}
              className={`flex items-center justify-center rounded px-2 py-1.5 text-sm transition-colors ${
                isSelected
                  ? 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
              }`}
            >
              <Icon name={option.icon} size="sm" />
            </button>
          );
        })}
      </div>
    </details>
  );
}
