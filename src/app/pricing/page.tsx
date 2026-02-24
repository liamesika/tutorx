import Navbar from '@/components/layout/Navbar';
import PricingCards from '@/components/marketing/PricingCards';
import FAQ from '@/components/marketing/FAQ';
import Footer from '@/components/layout/Footer';
import { GraduationCap, Check } from 'lucide-react';
import styles from './page.module.scss';

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>מחירים שקופים ופשוטים</h1>
            <p className={styles.subtitle}>
              התחילו בחינם, שדרגו כשתרצו. ללא התחייבות, ביטול בכל עת.
            </p>
          </div>
        </section>
        <PricingCards showTitle={false} />

        {/* Tutor pricing */}
        <section className={styles.tutorPricing}>
          <div className={styles.container}>
            <div className={styles.tutorCard}>
              <div className={styles.tutorCardContent}>
                <div className={styles.tutorIcon}>
                  <GraduationCap size={28} strokeWidth={1.75} />
                </div>
                <h2>מורים פרטיים</h2>
                <p className={styles.tutorDesc}>
                  הצטרפו כמורים פרטיים ב-Tutorix. הרשמה חינם, ללא דמי הצטרפות.
                </p>
                <div className={styles.commissionInfo}>
                  <div className={styles.commissionItem}>
                    <span className={styles.commissionValue}>15%</span>
                    <span className={styles.commissionLabel}>עמלה מכל שיעור</span>
                  </div>
                  <div className={styles.commissionItem}>
                    <span className={styles.commissionValue}>₪0</span>
                    <span className={styles.commissionLabel}>דמי הצטרפות</span>
                  </div>
                  <div className={styles.commissionItem}>
                    <span className={styles.commissionValue}>24 שעות</span>
                    <span className={styles.commissionLabel}>אישור פרופיל</span>
                  </div>
                </div>
                <ul className={styles.tutorFeatures}>
                  <li><Check size={16} strokeWidth={2} /> פרופיל מקצועי מלא</li>
                  <li><Check size={16} strokeWidth={2} /> ניהול לוח זמנים חכם</li>
                  <li><Check size={16} strokeWidth={2} /> מעקב הכנסות ותשלומים</li>
                  <li><Check size={16} strokeWidth={2} /> חשיפה לאלפי הורים</li>
                  <li><Check size={16} strokeWidth={2} /> מערכת ביקורות ודירוגים</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <FAQ />
      </main>
      <Footer />
    </>
  );
}
