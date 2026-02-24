import Link from 'next/link';
import {
  Check, Sparkles, Crown, Megaphone,
  BookOpen, MessageSquare, Star,
} from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import styles from './HomePricing.module.scss';

interface PlanCard {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  period: string;
  icon: ReactNode;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
  badge?: string;
}

const parentPlans: PlanCard[] = [
  {
    id: 'free',
    title: 'חינם',
    subtitle: 'תרגול חכם לתלמידי א׳–ו׳',
    price: '₪0',
    period: 'לתמיד',
    icon: <BookOpen size={22} strokeWidth={1.75} />,
    features: [
      'תרגול בכל המקצועות',
      'משוב AI מיידי',
      'מעקב התקדמות בסיסי',
      'תוכנית יומית',
    ],
    cta: 'התחילו בחינם',
    href: '/signup?role=student',
  },
  {
    id: 'premium-parent',
    title: 'ליווי אישי',
    subtitle: 'מענה מלא בוואטסאפ 16:00–18:00',
    price: '₪49',
    period: '/חודש',
    icon: <MessageSquare size={22} strokeWidth={1.75} />,
    features: [
      'כל היתרונות של חינם',
      'ליווי אישי בוואטסאפ',
      'מענה מלא בכל יום בין 16:00–18:00',
      'דוחות התקדמות מתקדמים',
      'המלצות AI מותאמות אישית',
    ],
    cta: 'שדרגו עכשיו',
    href: '/parent/subscription',
    featured: true,
    badge: 'הכי פופולרי',
  },
];

const tutorPlans: PlanCard[] = [
  {
    id: 'tutor-base',
    title: 'מורה רשום',
    subtitle: 'הפרופיל שלך באתר + קבלת תלמידים',
    price: '₪0',
    period: 'חינם',
    icon: <Star size={22} strokeWidth={1.75} />,
    features: [
      'פרופיל מורה מקצועי',
      'קבלת הזמנות שיעורים',
      'ניהול זמינות ולוח שנה',
      'דירוגים וביקורות',
    ],
    cta: 'הצטרפו כמורה',
    href: '/signup?role=tutor',
  },
  {
    id: 'tutor-featured',
    title: 'מורה מומלץ',
    subtitle: 'פרסומת לתלמידים בתוך הפלטפורמה',
    price: '₪99',
    period: '/חודש',
    icon: <Megaphone size={22} strokeWidth={1.75} />,
    features: [
      'כל היתרונות של מורה רשום',
      'מופיע כ"מורה מומלץ" בפיד',
      'חשיפה מוגברת לתלמידים חדשים',
      'תג "Featured" בפרופיל',
      'סטטיסטיקות מתקדמות',
    ],
    cta: 'שדרגו לפרימיום',
    href: '/tutor/subscription',
    featured: true,
    badge: 'Featured',
  },
];

function PlanCardUI({ plan }: { plan: PlanCard }) {
  return (
    <div className={`${styles.card} ${plan.featured ? styles.featured : ''}`}>
      {plan.badge && <div className={styles.badge}>{plan.badge}</div>}
      <div className={styles.cardHeader}>
        <div className={`${styles.planIcon} ${plan.featured ? styles.planIconFeatured : ''}`}>
          {plan.icon}
        </div>
        <h3 className={styles.planName}>{plan.title}</h3>
        <p className={styles.planSubtitle}>{plan.subtitle}</p>
      </div>
      <div className={styles.priceRow}>
        <span className={styles.priceValue}>{plan.price}</span>
        <span className={styles.pricePeriod}>{plan.period}</span>
      </div>
      <ul className={styles.features}>
        {plan.features.map((f, i) => (
          <li key={i}>
            <Check size={16} strokeWidth={2} className={styles.checkIcon} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link href={plan.href}>
        <Button variant={plan.featured ? 'primary' : 'secondary'} fullWidth>
          {plan.cta}
        </Button>
      </Link>
    </div>
  );
}

export default function HomePricing() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>מחירים</span>
          <h2 className={styles.title}>
            חינם מול <span className={styles.accent}>פרימיום</span>
          </h2>
          <p className={styles.subtitle}>תרגול חינמי לכולם. שדרגו כשתרצו — בלי התחייבות.</p>
          <p className={styles.guarantee}>ביטול בכל עת — ללא התחייבות</p>
        </div>

        {/* Parents / Students */}
        <div className={styles.planGroup}>
          <div className={styles.groupHeader}>
            <Sparkles size={18} strokeWidth={1.75} />
            <h3>להורים ותלמידים</h3>
          </div>
          <div className={styles.planGrid}>
            {parentPlans.map((plan) => (
              <PlanCardUI key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        {/* Tutors */}
        <div className={styles.planGroup}>
          <div className={styles.groupHeader}>
            <Crown size={18} strokeWidth={1.75} />
            <h3>למורים פרטיים</h3>
          </div>
          <div className={styles.planGrid}>
            {tutorPlans.map((plan) => (
              <PlanCardUI key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
