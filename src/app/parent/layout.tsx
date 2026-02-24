import AppShell from '@/components/layout/AppShell';
import type { NavItem } from '@/types';

const parentNav: NavItem[] = [
  { label: 'סקירה', href: '/parent', lucide: 'LayoutDashboard' },
  { label: 'ניתוח', href: '/parent/analytics', lucide: 'BarChart3' },
  { label: 'הזמנת מורה', href: '/parent/book-tutor', lucide: 'GraduationCap' },
  { label: 'מנוי', href: '/parent/subscription', lucide: 'CreditCard' },
];

const mobileNav: NavItem[] = [
  { label: 'בית', href: '/parent', lucide: 'LayoutDashboard' },
  { label: 'ניתוח', href: '/parent/analytics', lucide: 'BarChart3' },
  { label: 'מורה', href: '/parent/book-tutor', lucide: 'GraduationCap' },
  { label: 'מנוי', href: '/parent/subscription', lucide: 'CreditCard' },
];

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navItems={parentNav} sectionTitle="אזור הורה" mobileNavItems={mobileNav}>
      {children}
    </AppShell>
  );
}
