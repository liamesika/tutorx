'use client';

import { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.scss';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'flat';
  interactive?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Card({
  variant = 'elevated',
  interactive = false,
  padding = 'md',
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`${styles.card} ${styles[variant]} ${styles[`pad-${padding}`]} ${interactive ? styles.interactive : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
