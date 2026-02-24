import {
  Video,
  ShieldCheck,
  CreditCard,
  Target,
  CalendarCheck,
} from 'lucide-react';
import styles from './HomeTrustStrip.module.scss';

const trustItems = [
  { icon: <Video size={20} strokeWidth={1.75} />, label: 'שיעורים בזום + תזכורות' },
  { icon: <ShieldCheck size={20} strokeWidth={1.75} />, label: 'ביקורות מאומתות' },
  { icon: <CreditCard size={20} strokeWidth={1.75} />, label: 'תשלום מאובטח' },
  { icon: <Target size={20} strokeWidth={1.75} />, label: 'מותאם לכיתה ולחוזקות' },
  { icon: <CalendarCheck size={20} strokeWidth={1.75} />, label: 'תוכנית יומית עקבית' },
];

export default function HomeTrustStrip() {
  return (
    <section className={styles.strip} aria-label="יתרונות הפלטפורמה">
      <div className={styles.container}>
        <div className={styles.items}>
          {trustItems.map((item) => (
            <div key={item.label} className={styles.item}>
              <div className={styles.iconBox}>{item.icon}</div>
              <span className={styles.label}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
