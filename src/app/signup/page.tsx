'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Users, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import styles from './page.module.scss';

type Role = 'parent' | 'tutor' | null;

export default function SignupPage() {
  const [role, setRole] = useState<Role>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setError('');
    setLoading(true);

    const { error: err } = await signUp(email, password, name, role);

    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    // Redirect to role dashboard
    router.push(role === 'parent' ? '/parent' : '/tutor');
    router.refresh();
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo}>
              <GraduationCap size={22} strokeWidth={1.75} />
              <span className={styles.logoText}>Tutorix</span>
            </Link>
            <h1>צרו חשבון חדש</h1>
            <p>הצטרפו לאלפי משפחות שכבר לומדות איתנו</p>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {/* Role selection */}
          {!role && (
            <div className={styles.roleSelection}>
              <p className={styles.roleLabel}>אני רוצה להירשם בתור:</p>
              <div className={styles.roles}>
                <button
                  className={styles.roleCard}
                  onClick={() => setRole('parent')}
                >
                  <span className={styles.roleIcon}><Users size={28} strokeWidth={1.75} /></span>
                  <h3>הורה</h3>
                  <p>אני רוצה שהילד שלי ילמד וישתפר</p>
                </button>
                <button
                  className={styles.roleCard}
                  onClick={() => setRole('tutor')}
                >
                  <span className={styles.roleIcon}><BookOpen size={28} strokeWidth={1.75} /></span>
                  <h3>מורה פרטי</h3>
                  <p>אני רוצה ללמד ולהרוויח</p>
                </button>
              </div>
            </div>
          )}

          {/* Registration form */}
          {role && (
            <>
              <button
                className={styles.backBtn}
                onClick={() => setRole(null)}
              >
                → חזרה לבחירת תפקיד
              </button>
              <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                  label="שם מלא"
                  placeholder={role === 'parent' ? 'שם ההורה' : 'שם המורה'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
                <Input
                  label="אימייל"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
                <Input
                  label="סיסמה"
                  type="password"
                  placeholder="לפחות 8 תווים"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                />
                <Button fullWidth size="lg" disabled={loading}>
                  {loading
                    ? 'נרשם...'
                    : role === 'parent'
                      ? 'הרשמה כהורה'
                      : 'הרשמה כמורה'}
                </Button>
              </form>
            </>
          )}

          <div className={styles.divider}>
            <span>או</span>
          </div>

          <div className={styles.social}>
            <button className={styles.socialBtn} onClick={signInWithGoogle}>
              Google
            </button>
            <button className={styles.socialBtn} disabled>
              Apple
            </button>
          </div>

          <p className={styles.switch}>
            יש לכם חשבון?{' '}
            <Link href="/login">התחברו</Link>
          </p>

          <p className={styles.terms}>
            בהרשמה אתם מסכימים ל<Link href="#">תנאי השימוש</Link> ול<Link href="#">מדיניות הפרטיות</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
