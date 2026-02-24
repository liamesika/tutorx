'use client';

import { useState } from 'react';
import { mockStudents, mockParents, mockTutors } from '@/data/mock';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { Users, Search } from 'lucide-react';
import styles from './page.module.scss';

type RoleFilter = 'all' | 'student' | 'parent' | 'tutor';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  const allUsers = [
    ...mockStudents.map((s) => ({ ...s, roleName: 'תלמיד' })),
    ...mockParents.map((p) => ({ ...p, roleName: 'הורה' })),
    ...mockTutors.map((t) => ({ ...t, roleName: 'מורה' })),
  ];

  const filtered = allUsers.filter((user) => {
    const matchSearch = user.name.includes(search) || user.email.includes(search);
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleBadgeVariant = (role: string) => {
    switch (role) {
      case 'student': return 'primary' as const;
      case 'parent': return 'accent' as const;
      case 'tutor': return 'success' as const;
      default: return 'default' as const;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1><Users size={22} strokeWidth={1.75} /> ניהול משתמשים</h1>
        <p>{allUsers.length} משתמשים רשומים</p>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder="חיפוש לפי שם או אימייל..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={18} strokeWidth={1.75} />}
          fullWidth
        />
        <div className={styles.roleFilters}>
          {([['all', 'הכל'], ['student', 'תלמידים'], ['parent', 'הורים'], ['tutor', 'מורים']] as const).map(([key, label]) => (
            <button
              key={key}
              className={`${styles.filterBtn} ${roleFilter === key ? styles.active : ''}`}
              onClick={() => setRoleFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Card className={styles.tableWrapper}>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>משתמש</span>
            <span>אימייל</span>
            <span>תפקיד</span>
            <span>תאריך הצטרפות</span>
            <span>פעולות</span>
          </div>
          {filtered.map((user) => (
            <div key={user.id} className={styles.tableRow}>
              <div className={styles.userCell}>
                <Avatar name={user.name} size="sm" />
                <span>{user.name}</span>
              </div>
              <span className={styles.email}>{user.email}</span>
              <Badge variant={roleBadgeVariant(user.role)} size="sm">
                {user.roleName}
              </Badge>
              <span className={styles.date}>{user.createdAt}</span>
              <div className={styles.actions}>
                <Button variant="ghost" size="sm">צפייה</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
