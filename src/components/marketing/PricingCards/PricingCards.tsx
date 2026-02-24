import { Check } from 'lucide-react';
import { mockPricingPlans } from '@/data/mock';
import Button from '@/components/ui/Button';
import styles from './PricingCards.module.scss';

interface PricingCardsProps {
  showTitle?: boolean;
}

export default function PricingCards({ showTitle = true }: PricingCardsProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {showTitle && (
          <div className={styles.header}>
            <span className={styles.label}>מחירים</span>
            <h2 className={styles.title}>
              תוכניות <span className={styles.accent}>לכל כיס</span>
            </h2>
            <p className={styles.subtitle}>
              התחילו בחינם, שדרגו כשתרצו. ללא התחייבות.
            </p>
          </div>
        )}
        <div className={styles.grid}>
          {mockPricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`${styles.card} ${plan.isPopular ? styles.popular : ''}`}
            >
              {plan.isPopular && (
                <div className={styles.popularBadge}>הכי פופולרי</div>
              )}
              <div className={styles.cardHeader}>
                <h3 className={styles.planName}>{plan.nameHe}</h3>
                <div className={styles.price}>
                  {plan.price === 0 ? (
                    <span className={styles.priceValue}>חינם</span>
                  ) : (
                    <>
                      <span className={styles.currency}>₪</span>
                      <span className={styles.priceValue}>{plan.price}</span>
                      <span className={styles.period}>/ חודש</span>
                    </>
                  )}
                </div>
              </div>
              <ul className={styles.features}>
                {plan.features.map((feature, i) => (
                  <li key={i} className={styles.feature}>
                    <Check size={16} strokeWidth={2} className={styles.checkIcon} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.isPopular ? 'primary' : 'secondary'}
                fullWidth
              >
                {plan.price === 0 ? 'התחילו בחינם' : 'שדרגו עכשיו'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
