import AppShell from '@/components/layout/AppShell';
import type { NavItem } from '@/types';

const tutorNav: NavItem[] = [
  { label: 'לוח בקרה', href: '/tutor', lucide: 'LayoutDashboard' },
  { label: 'פרופיל', href: '/tutor/profile', lucide: 'UserCircle' },
  { label: 'יומן', href: '/tutor/calendar', lucide: 'Calendar' },
  { label: 'הכנסות', href: '/tutor/earnings', lucide: 'Wallet' },
  { label: 'מנוי', href: '/tutor/subscription', lucide: 'CreditCard' },
];

const mobileNav: NavItem[] = [
  { label: 'בית', href: '/tutor', lucide: 'LayoutDashboard' },
  { label: 'פרופיל', href: '/tutor/profile', lucide: 'UserCircle' },
  { label: 'יומן', href: '/tutor/calendar', lucide: 'Calendar' },
  { label: 'הכנסות', href: '/tutor/earnings', lucide: 'Wallet' },
];

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navItems={tutorNav} sectionTitle="אזור מורה" mobileNavItems={mobileNav}>
      {children}
    </AppShell>
  );
}
