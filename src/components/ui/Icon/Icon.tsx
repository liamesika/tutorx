import { ReactNode } from 'react';
import styles from './Icon.module.scss';

type Tone = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface IconProps {
  tone?: Tone;
  size?: Size;
  children: ReactNode;
  className?: string;
}

/** Base icon container with tone-based background */
export default function Icon({
  tone = 'primary',
  size = 'md',
  children,
  className = '',
}: IconProps) {
  return (
    <span className={`${styles.icon} ${styles[tone]} ${styles[size]} ${className}`}>
      {children}
    </span>
  );
}

/** Section header icon — 44px with xl radius */
export function SectionIcon({
  tone = 'primary',
  children,
  className = '',
}: Omit<IconProps, 'size'>) {
  return (
    <span className={`${styles.sectionIcon} ${styles[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Compact inline icon for chips/tags — 22px */
export function ChipIcon({
  tone = 'neutral',
  children,
  className = '',
}: Omit<IconProps, 'size'>) {
  return (
    <span className={`${styles.chipIcon} ${styles[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Large centered icon for empty states — 72px */
export function EmptyStateIcon({
  tone = 'neutral',
  children,
  className = '',
}: Omit<IconProps, 'size'>) {
  return (
    <span className={`${styles.emptyIcon} ${styles[tone]} ${className}`}>
      {children}
    </span>
  );
}
