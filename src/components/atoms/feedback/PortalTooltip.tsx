import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';

type TooltipTrigger = 'hover' | 'click' | 'both';
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface PortalTooltipProps {
  content: ReactNode;
  children: ReactElement;
  trigger?: TooltipTrigger;
  placement?: TooltipPlacement;
  offset?: number;
  openDelayMs?: number;
  closeDelayMs?: number;
  disabled?: boolean;
  maxWidth?: number;
}

const GAP = 8;
const VIEWPORT_PADDING = 8;

export function PortalTooltip({
  content,
  children,
  trigger = 'hover',
  placement = 'top',
  offset = GAP,
  openDelayMs = 80,
  closeDelayMs = 120,
  disabled = false,
  maxWidth = 320,
}: Readonly<PortalTooltipProps>) {
  const tooltipId = useId();
  const anchorRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
    opacity: 0,
    pointerEvents: 'none',
    zIndex: 9999,
  });

  const canOpenByHover = trigger === 'hover' || trigger === 'both';
  const canOpenByClick = trigger === 'click' || trigger === 'both';

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openTooltip = useCallback(() => {
    if (disabled) return;
    clearTimers();
    openTimerRef.current = window.setTimeout(() => {
      setIsOpen(true);
    }, openDelayMs);
  }, [clearTimers, disabled, openDelayMs]);

  const closeTooltip = useCallback(() => {
    clearTimers();
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, closeDelayMs);
  }, [clearTimers, closeDelayMs]);

  const toggleTooltip = useCallback(() => {
    if (disabled) return;
    clearTimers();
    setIsOpen((prev) => !prev);
  }, [clearTimers, disabled]);

  const calculatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    const tooltip = tooltipRef.current;
    if (!anchor || !tooltip) return;

    const anchorRect = anchor.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'bottom':
        top = anchorRect.bottom + offset;
        left = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        top = anchorRect.top + anchorRect.height / 2 - tooltipRect.height / 2;
        left = anchorRect.left - tooltipRect.width - offset;
        break;
      case 'right':
        top = anchorRect.top + anchorRect.height / 2 - tooltipRect.height / 2;
        left = anchorRect.right + offset;
        break;
      case 'top':
      default:
        top = anchorRect.top - tooltipRect.height - offset;
        left = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;
        break;
    }

    const maxLeft = window.innerWidth - tooltipRect.width - VIEWPORT_PADDING;
    const maxTop = window.innerHeight - tooltipRect.height - VIEWPORT_PADDING;
    left = Math.min(Math.max(left, VIEWPORT_PADDING), Math.max(VIEWPORT_PADDING, maxLeft));
    top = Math.min(Math.max(top, VIEWPORT_PADDING), Math.max(VIEWPORT_PADDING, maxTop));

    setStyle({
      position: 'fixed',
      top,
      left,
      maxWidth,
      opacity: 1,
      pointerEvents: 'auto',
      zIndex: 9999,
    });
  }, [maxWidth, offset, placement]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    calculatePosition();
  }, [isOpen, calculatePosition, content]);

  useEffect(() => {
    if (!isOpen) return;
    const handleReposition = () => calculatePosition();
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    if (!isOpen || !canOpenByClick) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const anchor = anchorRef.current;
      const tooltip = tooltipRef.current;
      if (!anchor || !tooltip) return;
      if (anchor.contains(target) || tooltip.contains(target)) return;
      setIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, canOpenByClick]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  if (!isValidElement(children)) return children;

  const child = children as ReactElement<Record<string, unknown>>;
  const existingProps = child.props;

  const enhancedChild = cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      anchorRef.current = node;
      const originalRef = (child as ReactElement & { ref?: unknown }).ref;
      if (typeof originalRef === 'function') {
        originalRef(node);
      } else if (originalRef && typeof originalRef === 'object' && 'current' in originalRef) {
        (originalRef as { current: HTMLElement | null }).current = node;
      }
    },
    'aria-describedby': isOpen ? tooltipId : existingProps['aria-describedby'],
    onMouseEnter: canOpenByHover
      ? (event: unknown) => {
          const original = existingProps.onMouseEnter as ((e: unknown) => void) | undefined;
          original?.(event);
          openTooltip();
        }
      : existingProps.onMouseEnter,
    onMouseLeave: canOpenByHover
      ? (event: unknown) => {
          const original = existingProps.onMouseLeave as ((e: unknown) => void) | undefined;
          original?.(event);
          closeTooltip();
        }
      : existingProps.onMouseLeave,
    onFocus: canOpenByHover
      ? (event: unknown) => {
          const original = existingProps.onFocus as ((e: unknown) => void) | undefined;
          original?.(event);
          openTooltip();
        }
      : existingProps.onFocus,
    onBlur: canOpenByHover
      ? (event: unknown) => {
          const original = existingProps.onBlur as ((e: unknown) => void) | undefined;
          original?.(event);
          closeTooltip();
        }
      : existingProps.onBlur,
    onClick: canOpenByClick
      ? (event: unknown) => {
          const original = existingProps.onClick as ((e: unknown) => void) | undefined;
          original?.(event);
          toggleTooltip();
        }
      : existingProps.onClick,
  });

  return (
    <>
      {enhancedChild}
      {isOpen &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            style={style}
            onMouseEnter={canOpenByHover ? clearTimers : undefined}
            onMouseLeave={canOpenByHover ? closeTooltip : undefined}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2 text-xs text-[var(--color-text-primary)] shadow-lg"
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
