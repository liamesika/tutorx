import Link from 'next/link';
import { Calculator, BookText, Globe, ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './HomeSubjects.module.scss';

const subjects: { id: string; name: string; desc: string; icon: ReactNode; color: string }[] = [
  {
    id: 'math',
    name: 'חשבון',
    desc: 'חיבור, חיסור, כפל, חילוק, שברים ובעיות מילוליות',
    icon: <Calculator size={28} strokeWidth={1.75} />,
    color: 'primary',
  },
  {
    id: 'hebrew',
    name: 'עברית',
    desc: 'הבנת הנקרא, כתיבה, דקדוק ואוצר מילים',
    icon: <BookText size={28} strokeWidth={1.75} />,
    color: 'accent',
  },
  {
    id: 'english',
    name: 'אנגלית',
    desc: 'קריאה, כתיבה, אוצר מילים ודקדוק בסיסי',
    icon: <Globe size={28} strokeWidth={1.75} />,
    color: 'cyan',
  },
];

export default function HomeSubjects() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>נושאי תרגול</span>
          <h2 className={styles.title}>
            שלושת המקצועות <span className={styles.accent}>שהכי חשוב לתרגל</span>
          </h2>
          <p className={styles.subtitle}>תרגול מותאם לכיתות א׳–ו׳ עם משוב AI מיידי</p>
        </div>
        <div className={styles.grid}>
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href="/signup?role=student"
              className={styles.tile}
              data-color={subject.color}
            >
              <div className={styles.tileIcon}>{subject.icon}</div>
              <h3 className={styles.tileName}>{subject.name}</h3>
              <span className={styles.tileBadge}>תרגולים</span>
              <p className={styles.tileDesc}>{subject.desc}</p>
              <span className={styles.tileCta}>
                לתרגול <ArrowLeft size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
