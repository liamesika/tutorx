import Image from 'next/image';
import { UserPlus, BookOpen, Bot } from 'lucide-react';
import type { ReactNode } from 'react';
import IconBox from '@/components/ui/IconBox';
import styles from './HomeHowItWorks.module.scss';

type Variant = 'primary' | 'accent' | 'cyan';

const steps: { num: string; icon: ReactNode; variant: Variant; title: string; desc: string }[] = [
  {
    num: '1',
    icon: <UserPlus size={24} strokeWidth={1.75} />,
    variant: 'primary',
    title: 'נרשמים בחינם',
    desc: 'יוצרים חשבון תוך דקה. בלי כרטיס אשראי, בלי התחייבות.',
  },
  {
    num: '2',
    icon: <BookOpen size={24} strokeWidth={1.75} />,
    variant: 'accent',
    title: 'בוחרים כיתה ונושאים',
    desc: 'בחרו את הכיתה והמקצועות — המערכת מתאימה את התרגול לרמה.',
  },
  {
    num: '3',
    icon: <Bot size={24} strokeWidth={1.75} />,
    variant: 'cyan',
    title: 'מתרגלים ומקבלים משוב',
    desc: 'תרגול חכם עם משוב AI מיידי. צריכים עזרה נוספת? הזמינו מורה בזום.',
  },
];

export default function HomeHowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>איך זה עובד</span>
          <h2 className={styles.title}>
            3 צעדים פשוטים <span className={styles.accent}>להתחיל</span>
          </h2>
        </div>
        <div className={styles.grid}>
          {steps.map((step, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.numBadge}>{step.num}</div>
              <IconBox variant={step.variant} size="lg" className={styles.iconBox}>{step.icon}</IconBox>
              <h3 className={styles.cardTitle}>{step.title}</h3>
              <p className={styles.cardDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
        <div className={styles.demoImage}>
          <Image
            src="/media/home/platform-demo.png"
            alt="Tutorix — ממשק תרגול חכם"
            width={900}
            height={500}
            className={styles.demoImg}
            sizes="(max-width: 768px) 100vw, 900px"
          />
        </div>
      </div>
    </section>
  );
}
