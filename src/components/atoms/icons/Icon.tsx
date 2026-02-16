import { forwardRef } from 'react';
import type { CSSProperties, ComponentPropsWithoutRef } from 'react';

type IconSize = 'sm' | 'md' | 'lg' | 'xl';

interface IconProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'color'> {
  name: string;
  size?: IconSize;
  color?: string;
  filled?: boolean;
  ariaLabel?: string;
}

const ICON_SIZE_MAP: Record<IconSize, number> = {
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};

export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  {
    name,
    size = 'md',
    color = 'currentColor',
    filled = false,
    className,
    ariaLabel,
    style,
    ...rest
  },
  ref
) {
  const pixelSize = ICON_SIZE_MAP[size];

  const iconStyle: CSSProperties = {
    fontSize: pixelSize,
    lineHeight: 1,
    color,
    fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${pixelSize}`,
    userSelect: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  const commonProps = ariaLabel
    ? { role: 'img', 'aria-label': ariaLabel }
    : { 'aria-hidden': true };

  return (
    <span
      ref={ref}
      className={['material-symbols-outlined', className].filter(Boolean).join(' ')}
      style={iconStyle}
      {...commonProps}
      {...rest}
    >
      {name}
    </span>
  );
});
