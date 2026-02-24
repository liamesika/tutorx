'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Star, PartyPopper, GraduationCap, Calendar, Wallet, ArrowUpCircle, BarChart3, Check } from 'lucide-react';
import styles from './page.module.scss';

function TutorSubscriptionContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'tutor_subscription' }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setUpgrading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1><Star size={20} strokeWidth={1.75} /> סטטוס מנוי</h1>
        <p>נהלו את חשבון המורה שלכם</p>
      </div>

      {success && (
        <Card className={styles.successBanner}>
          <p><PartyPopper size={18} strokeWidth={1.75} /> שודרגתם לפרימיום! תהנו מחשיפה מקסימלית.</p>
        </Card>
      )}

      <Card className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <Badge variant="success">פעיל</Badge>
          <h2>חשבון מורה מאומת</h2>
        </div>
        <div className={styles.statusGrid}>
          <div className={styles.statusItem}>
            <span className={styles.statusIcon}><GraduationCap size={18} strokeWidth={1.75} /></span>
            <span className={styles.statusLabel}>סטטוס</span>
            <span className={styles.statusValue}>מורה מאושר</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusIcon}><Calendar size={18} strokeWidth={1.75} /></span>
            <span className={styles.statusLabel}>חבר מאז</span>
            <span className={styles.statusValue}>ינואר 2024</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusIcon}><Wallet size={18} strokeWidth={1.75} /></span>
            <span className={styles.statusLabel}>עמלה</span>
            <span className={styles.statusValue}>15%</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusIcon}><Star size={18} strokeWidth={1.75} /></span>
            <span className={styles.statusLabel}>דירוג</span>
            <span className={styles.statusValue}>4.9/5</span>
          </div>
        </div>
      </Card>

      <Card className={styles.benefitsCard}>
        <h3>מה כלול בחשבון שלכם</h3>
        <ul className={styles.benefitsList}>
          <li><Check size={16} strokeWidth={2} /> פרופיל מקצועי עם ביקורות</li>
          <li><Check size={16} strokeWidth={2} /> מערכת הזמנות אוטומטית</li>
          <li><Check size={16} strokeWidth={2} /> לוח זמנים חכם</li>
          <li><Check size={16} strokeWidth={2} /> מעקב הכנסות ותשלומים</li>
          <li><Check size={16} strokeWidth={2} /> חשיפה ל-12,000+ הורים</li>
          <li><Check size={16} strokeWidth={2} /> תמיכה טכנית</li>
        </ul>
      </Card>

      <Card className={styles.upgradeCard}>
        <div className={styles.upgradeHeader}>
          <Badge variant="accent">פרימיום למורים</Badge>
          <h3>שדרגו לחשיפה מקסימלית</h3>
          <p>מורים פרימיום מופיעים ראשונים בחיפוש ומקבלים תגי &quot;מומלץ&quot;</p>
        </div>
        <div className={styles.upgradePrice}>
          <span className={styles.price}>₪99</span>
          <span className={styles.period}>/חודש</span>
        </div>
        <ul className={styles.upgradeFeatures}>
          <li><ArrowUpCircle size={16} strokeWidth={1.75} /> מיקום מועדף בתוצאות חיפוש</li>
          <li><Star size={16} strokeWidth={1.75} /> תג &quot;מורה מומלץ&quot;</li>
          <li><BarChart3 size={16} strokeWidth={1.75} /> אנליטיקס מתקדם על הפרופיל</li>
          <li><Wallet size={16} strokeWidth={1.75} /> עמלה מופחתת — 10% במקום 15%</li>
        </ul>
        <Button fullWidth size="lg" onClick={handleUpgrade} disabled={upgrading}>
          {upgrading ? 'מעבד...' : 'שדרגו עכשיו'}
        </Button>
      </Card>
    </div>
  );
}

export default function TutorSubscriptionPage() {
  return (
    <Suspense>
      <TutorSubscriptionContent />
    </Suspense>
  );
}
