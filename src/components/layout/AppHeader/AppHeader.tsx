'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import styles from './AppHeader.module.scss';

interface AppHeaderProps {
  sectionTitle: string;
}

const roleProfilePath: Record<string, string> = {
  student: '/student/profile',
  tutor: '/tutor/profile',
  parent: '/parent',
  admin: '/admin',
};

export default function AppHeader({ sectionTitle }: AppHeaderProps) {
  const { profile, role, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Right side: Logo + section title */}
        <div className={styles.right}>
          <Link href="/" className={styles.logo}>
            {!logoError ? (
              <Image
                src="/brand/logo.png"
                alt="Tutorix"
                width={34}
                height={34}
                className={styles.logoImage}
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className={styles.logoMark}>T</div>
            )}
            <span className={styles.logoText}>Tutorix</span>
          </Link>
          <div className={styles.divider} />
          <span className={styles.sectionTitle}>{sectionTitle}</span>
        </div>

        {/* Left side: User menu */}
        <div className={styles.left} ref={menuRef}>
          {profile && (
            <button className={styles.userBtn} onClick={() => setMenuOpen(!menuOpen)}>
              <Avatar name={profile.full_name} src={profile.avatar_url || undefined} size="sm" />
              <span className={styles.userName}>{profile.full_name}</span>
              <ChevronDown size={16} className={`${styles.chevron} ${menuOpen ? styles.chevronOpen : ''}`} />
            </button>
          )}

          {menuOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <Avatar name={profile?.full_name || ''} src={profile?.avatar_url || undefined} size="md" />
                <div>
                  <p className={styles.dropdownName}>{profile?.full_name}</p>
                  <p className={styles.dropdownRole}>
                    {role === 'student' ? 'תלמיד' : role === 'tutor' ? 'מורה' : role === 'parent' ? 'הורה' : 'אדמין'}
                  </p>
                </div>
              </div>
              <div className={styles.dropdownDivider} />
              <Link href={roleProfilePath[role || 'student']} className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                <User size={18} />
                <span>הפרופיל שלי</span>
              </Link>
              <Link href={`/${role}/settings`} className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                <Settings size={18} />
                <span>הגדרות</span>
              </Link>
              <div className={styles.dropdownDivider} />
              <button className={styles.dropdownItem} onClick={() => { signOut(); setMenuOpen(false); }} data-danger>
                <LogOut size={18} />
                <span>התנתקות</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
