'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/types';
import * as LucideIcons from 'lucide-react';
import styles from './AppMobileNav.module.scss';

interface AppMobileNavProps {
  items: NavItem[];
}

function getLucideIcon(name?: string) {
  if (!name) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name] as React.ComponentType<{ size?: number }> | undefined;
  return Icon ? <Icon size={20} /> : null;
}

export default function AppMobileNav({ items }: AppMobileNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/student' || href === '/tutor' || href === '/parent' || href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className={styles.mobileNav}>
      {items.slice(0, 5).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${styles.item} ${isActive(item.href) ? styles.active : ''}`}
        >
          <span className={styles.icon}>
            {item.lucide ? getLucideIcon(item.lucide) : null}
          </span>
          <span className={styles.label}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
