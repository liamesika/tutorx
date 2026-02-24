'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/types';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  items: NavItem[];
  title: string;
  icon: string;
}

export default function Sidebar({ items, title, icon }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <nav className={styles.nav}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.link} ${pathname === item.href ? styles.active : ''}`}
          >
            {item.icon && <span className={styles.linkIcon}>{item.icon}</span>}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
