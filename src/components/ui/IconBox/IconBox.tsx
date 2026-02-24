import { ReactNode } from 'react';
import styles from './IconBox.module.scss';

interface IconBoxProps {
  children: ReactNode;
  variant?: 'primary' | 'accent' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function IconBox({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: IconBoxProps) {
  return (
    <div className={`${styles.iconBox} ${styles[variant]} ${styles[size]} ${className}`}>
      {children}
    </div>
  );
}
