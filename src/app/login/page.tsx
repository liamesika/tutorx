'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import styles from './page.module.scss';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: err } = await signIn(email, password);

    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    router.push(redirect ?? '/');
    router.refresh();
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          <GraduationCap size={22} strokeWidth={1.75} />
          <span className={styles.logoText}>Tutorix</span>
        </Link>
        <h1>ברוכים השבים!</h1>
        <p>התחברו לחשבון שלכם</p>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
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
          placeholder="הזינו סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <div className={styles.options}>
          <label className={styles.remember}>
            <input type="checkbox" />
            <span>זכור אותי</span>
          </label>
          <Link href="#" className={styles.forgot}>שכחתי סיסמה</Link>
        </div>
        <Button fullWidth size="lg" disabled={loading}>
          {loading ? 'מתחבר...' : 'התחברות'}
        </Button>
      </form>

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
        אין לכם חשבון?{' '}
        <Link href="/signup">הרשמו בחינם</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
