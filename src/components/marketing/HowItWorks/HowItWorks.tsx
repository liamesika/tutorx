import { ClipboardList, Bot, TrendingUp, GraduationCap } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './HowItWorks.module.scss';

const steps: { number: string; icon: ReactNode; title: string; description: string }[] = [
  {
    number: '01',
    icon: <ClipboardList size={22} strokeWidth={1.75} />,
    title: 'הרשמה מהירה',
    description: 'צרו חשבון בחינם, בחרו כיתה ומקצועות — תוך דקה אתם בפנים.',
  },
  {
    number: '02',
    icon: <Bot size={22} strokeWidth={1.75} />,
    title: 'תרגול חכם עם AI',
    description: 'התחילו לתרגל. המערכת מנתחת את הרמה ומתאימה שאלות ברמת קושי מדויקת.',
  },
  {
    number: '03',
    icon: <TrendingUp size={22} strokeWidth={1.75} />,
    title: 'מעקב והתקדמות',
    description: 'הורים מקבלים דוחות מפורטים. ה-AI מזהה חולשות וממליץ על שיפורים.',
  },
  {
    number: '04',
    icon: <GraduationCap size={22} strokeWidth={1.75} />,
    title: 'מורה פרטי (אופציונלי)',
    description: 'צריכים עזרה נוספת? הזמינו שיעור עם מורה פרטי מאומת ישירות מהמערכת.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>איך זה עובד?</span>
          <h2 className={styles.title}>
            4 צעדים פשוטים
            <br />
            <span className={styles.accent}>להצלחה של הילד</span>
          </h2>
        </div>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.numberWrapper}>
                <span className={styles.number}>{step.number}</span>
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className={styles.connector} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
