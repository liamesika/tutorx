'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/types';
import styles from './MobileNav.module.scss';

interface MobileNavProps {
  items: NavItem[];
}

export default function MobileNav({ items }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className={styles.mobileNav}>
      {items.slice(0, 5).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${styles.item} ${pathname === item.href ? styles.active : ''}`}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
