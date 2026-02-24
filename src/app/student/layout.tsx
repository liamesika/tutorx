import AppShell from '@/components/layout/AppShell';
import type { NavItem } from '@/types';

const studentNav: NavItem[] = [
  { label: 'לוח בקרה', href: '/student', lucide: 'LayoutDashboard' },
  { label: 'מורים', href: '/student/feed', lucide: 'Search' },
  { label: 'תרגול', href: '/student/exercise', lucide: 'PenTool' },
  { label: 'תוכנית יומית', href: '/student/plan', lucide: 'CalendarCheck' },
  { label: 'סיכום', href: '/student/summary', lucide: 'BarChart3' },
  { label: 'פרופיל', href: '/student/profile', lucide: 'UserCircle' },
];

const mobileNav: NavItem[] = [
  { label: 'בית', href: '/student', lucide: 'LayoutDashboard' },
  { label: 'תרגול', href: '/student/exercise', lucide: 'PenTool' },
  { label: 'תוכנית', href: '/student/plan', lucide: 'CalendarCheck' },
  { label: 'מורים', href: '/student/feed', lucide: 'Search' },
  { label: 'פרופיל', href: '/student/profile', lucide: 'UserCircle' },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navItems={studentNav} sectionTitle="אזור תלמיד" mobileNavItems={mobileNav}>
      {children}
    </AppShell>
  );
}
