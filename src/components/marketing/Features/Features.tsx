import { Bot, BarChart3, Trophy, GraduationCap, Smartphone, Shield } from 'lucide-react';
import styles from './Features.module.scss';

const features = [
  {
    icon: <Bot size={22} strokeWidth={1.75} />,
    title: 'למידה מבוססת AI',
    description: 'המערכת מזהה את נקודות החולשה ומתאימה תרגילים ברמת הקושי הנכונה לכל תלמיד.',
  },
  {
    icon: <BarChart3 size={22} strokeWidth={1.75} />,
    title: 'מעקב התקדמות',
    description: 'דוחות מפורטים להורים עם תובנות AI, גרפים וניתוח מגמות שבועי.',
  },
  {
    icon: <Trophy size={22} strokeWidth={1.75} />,
    title: 'למידה כיפית',
    description: 'מערכת XP, רמות והישגים שהופכת את הלמידה לחוויה מהנה ומניעה.',
  },
  {
    icon: <GraduationCap size={22} strokeWidth={1.75} />,
    title: 'מורים מובילים',
    description: 'מאגר מורים פרטיים מאומתים עם דירוגים, ביקורות וזמינות בזמן אמת.',
  },
  {
    icon: <Smartphone size={22} strokeWidth={1.75} />,
    title: 'בכל מקום ובכל זמן',
    description: 'ממשק מותאם לנייד שמאפשר לתרגל מכל מקום — בבית, בנסיעה או בהפסקה.',
  },
  {
    icon: <Shield size={22} strokeWidth={1.75} />,
    title: 'בטוח ומאובטח',
    description: 'הצפנה מתקדמת, הגנה על פרטיות ילדים וסביבה מאובטחת ללא פרסומות.',
  },
];

export default function Features() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>למה Tutorix?</span>
          <h2 className={styles.title}>
            הכלים שהילד שלך צריך
            <br />
            כדי <span className={styles.accent}>להצליח</span>
          </h2>
          <p className={styles.subtitle}>
            שילוב מנצח של טכנולוגיה חכמה ומורים מקצועיים
          </p>
        </div>
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
