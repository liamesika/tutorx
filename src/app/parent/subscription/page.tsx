'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockPricingPlans } from '@/data/mock';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { CreditCard, Check, PartyPopper } from 'lucide-react';
import styles from './page.module.scss';

function SubscriptionContent() {
  const currentPlan = mockPricingPlans[1];
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'parent_subscription' }),
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
        <h1><CreditCard size={22} strokeWidth={1.75} /> ניהול מנוי</h1>
        <p>נהלו את המנוי ואמצעי התשלום שלכם</p>
      </div>

      {success && (
        <Card className={styles.successBanner}>
          <p><PartyPopper size={18} strokeWidth={1.75} /> המנוי שודרג בהצלחה! תהנו מכל הפיצ׳רים.</p>
        </Card>
      )}

      <Card className={styles.currentPlan}>
        <div className={styles.planHeader}>
          <div>
            <Badge variant="primary">מנוי נוכחי</Badge>
            <h2>{currentPlan.nameHe}</h2>
            <p className={styles.planPrice}>₪{currentPlan.price}/חודש</p>
          </div>
          <div className={styles.planStatus}>
            <Badge variant="success">פעיל</Badge>
            <p>חידוש: 01/03/2026</p>
          </div>
        </div>
        <div className={styles.planFeatures}>
          {currentPlan.features.map((feature, i) => (
            <span key={i} className={styles.feature}><Check size={16} strokeWidth={2} /> {feature}</span>
          ))}
        </div>
      </Card>

      <div className={styles.section}>
        <h2>אמצעי תשלום</h2>
        <Card className={styles.paymentCard}>
          <div className={styles.cardInfo}>
            <div className={styles.cardIcon}><CreditCard size={20} strokeWidth={1.75} /></div>
            <div>
              <p className={styles.cardNumber}>•••• •••• •••• 4242</p>
              <p className={styles.cardExpiry}>תוקף: 12/27</p>
            </div>
            <Button variant="ghost" size="sm">עריכה</Button>
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h2>חשבוניות</h2>
        <div className={styles.invoices}>
          {[
            { date: 'פברואר 2026', amount: 49, status: 'שולם' },
            { date: 'ינואר 2026', amount: 49, status: 'שולם' },
            { date: 'דצמבר 2025', amount: 49, status: 'שולם' },
          ].map((invoice, i) => (
            <Card key={i} variant="outlined" padding="sm" className={styles.invoiceRow}>
              <span className={styles.invoiceDate}>{invoice.date}</span>
              <span className={styles.invoiceAmount}>₪{invoice.amount}</span>
              <Badge variant="success" size="sm">{invoice.status}</Badge>
              <Button variant="ghost" size="sm">הורדה</Button>
            </Card>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={handleUpgrade} disabled={upgrading}>
          {upgrading ? 'מעבד...' : 'שינוי תוכנית'}
        </Button>
        <Button variant="ghost">ביטול מנוי</Button>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense>
      <SubscriptionContent />
    </Suspense>
  );
}
