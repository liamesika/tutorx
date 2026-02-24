'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import styles from './Navbar.module.scss';

const roleDashboard: Record<string, { path: string; label: string }> = {
  student: { path: '/student', label: 'אזור תלמיד' },
  parent: { path: '/parent', label: 'אזור הורה' },
  tutor: { path: '/tutor', label: 'אזור מורה' },
  admin: { path: '/admin', label: 'ניהול' },
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { user, profile, role, loading, signOut } = useAuth();

  const dashboardInfo = role ? roleDashboard[role] : null;

  useEffect(() => {
    if (logoError) {
      console.warn('[Tutorix] Logo asset missing at /brand/logo.png — using text fallback.');
    }
  }, [logoError]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          {!logoError ? (
            <Image
              src="/brand/logo.png"
              alt="Tutorix"
              width={120}
              height={120}
              className={styles.logoImage}
              onError={() => setLogoError(true)}
              priority
            />
          ) : (
            <span className={styles.logoMark}>T</span>
          )}
        </Link>

        <div className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.links}>
            <Link href="/how-it-works" className={styles.link}>
              איך זה עובד
            </Link>
            <Link href="/pricing" className={styles.link}>
              מחירים
            </Link>
            <Link href="/tutors" className={styles.link}>
              מורים פרטיים
            </Link>
          </div>
          <div className={styles.actions}>
            {loading ? null : user && profile ? (
              <>
                {dashboardInfo && (
                  <Link href={dashboardInfo.path}>
                    <Button variant="ghost" size="sm">
                      {dashboardInfo.label}
                    </Button>
                  </Link>
                )}
                <div className={styles.userMenu}>
                  <Avatar name={profile.full_name} size="sm" />
                  <button className={styles.signOutBtn} onClick={signOut}>
                    יציאה
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    התחברות
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    הרשמה חינם
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <button
          className={`${styles.burger} ${isMenuOpen ? styles.active : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="תפריט"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
