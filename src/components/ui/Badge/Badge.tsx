import { ReactNode } from 'react';
import styles from './Badge.module.scss';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary' | 'accent';
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
}

export default function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]} ${className}`}>
      {children}
    </span>
  );
}
