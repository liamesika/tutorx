'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Star, Users, Facebook, Instagram, Twitter } from 'lucide-react';
import styles from './Footer.module.scss';

export default function Footer() {
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (logoError) {
      console.warn('[Tutorix] Footer logo asset missing at /brand/logo.png — using text fallback.');
    }
  }, [logoError]);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              {!logoError ? (
                <Image
                  src="/brand/logo.png"
                  alt="Tutorix"
                  width={140}
                  height={140}
                  className={styles.logoImage}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className={styles.logoMark}>T</span>
              )}
            </div>
            <p className={styles.tagline}>
              פלטפורמת הלמידה החכמה לתלמידי יסודי
            </p>
            <p className={styles.description}>
              תרגול חינמי בכל המקצועות עם משוב AI מיידי.
              מורים פרטיים מאומתים בזום — ישירות מהפלטפורמה.
            </p>
            <div className={styles.trust}>
              <span><Shield size={14} strokeWidth={1.75} /> מאובטח</span>
              <span><Star size={14} strokeWidth={1.75} /> דירוג 4.9</span>
              <span><Users size={14} strokeWidth={1.75} /> 12,000+ משפחות</span>
            </div>
          </div>

          {/* Links */}
          <div className={styles.column}>
            <h4>פלטפורמה</h4>
            <Link href="/how-it-works">איך זה עובד</Link>
            <Link href="/pricing">מחירים</Link>
            <Link href="/tutors">מאגר מורים</Link>
            <Link href="/signup">הרשמה</Link>
          </div>

          <div className={styles.column}>
            <h4>תמיכה</h4>
            <Link href="#">שאלות נפוצות</Link>
            <Link href="#">צור קשר</Link>
            <Link href="#">מרכז העזרה</Link>
            <Link href="#">דווח על בעיה</Link>
          </div>

          <div className={styles.column}>
            <h4>חברה</h4>
            <Link href="#">אודות</Link>
            <Link href="#">בלוג</Link>
            <Link href="#">קריירה</Link>
            <Link href="#">תנאי שימוש</Link>
            <Link href="#">מדיניות פרטיות</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2026 Tutorix. כל הזכויות שמורות.</p>
          <div className={styles.social}>
            <a href="#" aria-label="Facebook"><Facebook size={18} strokeWidth={1.75} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={18} strokeWidth={1.75} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={18} strokeWidth={1.75} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
