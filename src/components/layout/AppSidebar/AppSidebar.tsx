'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/types';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';
import styles from './AppSidebar.module.scss';

interface AppSidebarProps {
  items: NavItem[];
}

function getLucideIcon(name?: string) {
  if (!name) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name] as React.ComponentType<{ size?: number }> | undefined;
  return Icon ? <Icon size={20} /> : null;
}

export default function AppSidebar({ items }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/student' || href === '/tutor' || href === '/parent' || href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <div className={styles.section}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive(item.href) ? styles.active : ''}`}
            >
              <span className={styles.iconWrap}>
                {item.lucide ? getLucideIcon(item.lucide) : null}
              </span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
      <div className={styles.footer}>
        <Link href="/support" className={styles.link}>
          <span className={styles.iconWrap}><HelpCircle size={20} /></span>
          <span className={styles.label}>עזרה ותמיכה</span>
        </Link>
      </div>
    </aside>
  );
}
