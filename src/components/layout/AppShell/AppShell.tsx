'use client';

import { ReactNode } from 'react';
import type { NavItem } from '@/types';
import AppHeader from '../AppHeader';
import AppSidebar from '../AppSidebar';
import AppMobileNav from '../AppMobileNav';
import styles from './AppShell.module.scss';

interface AppShellProps {
  children: ReactNode;
  navItems: NavItem[];
  sectionTitle: string;
  mobileNavItems?: NavItem[];
}

export default function AppShell({ children, navItems, sectionTitle, mobileNavItems }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <AppHeader sectionTitle={sectionTitle} />
      <div className={styles.body}>
        <AppSidebar items={navItems} />
        <main className={styles.main}>
          {children}
        </main>
      </div>
      <AppMobileNav items={mobileNavItems || navItems.slice(0, 5)} />
    </div>
  );
}
