import type { ReactNode, ElementType } from 'react';

// ────────────────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────────────────

type HeadingSize = 'xl' | '2xl' | '3xl';

type Variant = 'dark' | 'light';

interface BaseTypographyProps {
  children: ReactNode;
  className?: string;
}

interface HeadingProps extends BaseTypographyProps {
  as?: ElementType;
  size?: HeadingSize;
  variant?: Variant;
}

interface SubTextProps extends BaseTypographyProps {
  size?: 'sm' | 'base';
  muted?: boolean;
}

interface MicroLabelProps extends BaseTypographyProps {
  variant?: Variant;
}

// ────────────────────────────────────────────────────────────
// SECTION LABEL
// ────────────────────────────────────────────────────────────

export function SectionLabel({
  children,
  className = '',
}: BaseTypographyProps) {
  return (
    <span
      className={`
                text-brand-orange
                font-bold
                text-[10px]
                tracking-[0.2em]
                uppercase
                mb-4
                block
                ${className}
            `}
    >
      {children}
    </span>
  );
}

// ────────────────────────────────────────────────────────────
// HEADING
// ────────────────────────────────────────────────────────────

const HEADING_SIZE: Record<HeadingSize, string> = {
  xl: 'text-4xl md:text-5xl',

  '2xl': 'text-5xl md:text-6xl',

  '3xl': 'text-6xl md:text-[5.5rem]',
};

export function Heading({
  children,
  as: Tag = 'h2',
  size = '2xl',
  variant = 'dark',
  className = '',
}: HeadingProps) {
  const color =
    variant === 'light'
      ? 'text-white'
      : 'text-brand-blue';

  return (
    <Tag
      className={`
                font-display
                font-bold
                leading-[1.05]
                tracking-tight
                ${HEADING_SIZE[size]}
                ${color}
                ${className}
            `}
    >
      {children}
    </Tag>
  );
}

// ────────────────────────────────────────────────────────────
// ACCENT TEXT
// ────────────────────────────────────────────────────────────

export function AccentText({
  children,
  className = '',
}: BaseTypographyProps) {
  return (
    <span
      className={`
                text-brand-orange
                ${className}
            `}
    >
      {children}
    </span>
  );
}

// ────────────────────────────────────────────────────────────
// SUB TEXT
// ────────────────────────────────────────────────────────────

export function SubText({
  children,
  size = 'sm',
  muted = true,
  className = '',
}: SubTextProps) {
  const textSize =
    size === 'base'
      ? 'text-base'
      : 'text-sm';

  const textColor = muted
    ? 'text-brand-blue/60'
    : 'text-brand-blue';

  return (
    <p
      className={`
                ${textSize}
                ${textColor}
                leading-relaxed
                font-medium
                ${className}
            `}
    >
      {children}
    </p>
  );
}

// ────────────────────────────────────────────────────────────
// MICRO LABEL
// ────────────────────────────────────────────────────────────

export function MicroLabel({
  children,
  variant = 'dark',
  className = '',
}: MicroLabelProps) {
  const color =
    variant === 'light'
      ? 'text-white/30'
      : 'text-brand-blue/30';

  return (
    <span
      className={`
                text-[10px]
                font-bold
                uppercase
                tracking-widest
                ${color}
                ${className}
            `}
    >
      {children}
    </span>
  );
}