import AppShell from '@/components/layout/AppShell';
import type { NavItem } from '@/types';

const adminNav: NavItem[] = [
  { label: 'סקירה', href: '/admin', lucide: 'LayoutDashboard' },
  { label: 'משתמשים', href: '/admin/users', lucide: 'Users' },
  { label: 'הכנסות', href: '/admin/revenue', lucide: 'TrendingUp' },
  { label: 'אישורים', href: '/admin/approvals', lucide: 'CheckCircle' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navItems={adminNav} sectionTitle="ניהול מערכת">
      {children}
    </AppShell>
  );
}
