import Link from 'next/link';
import {
  ArrowLeft,
  Video,
  Star,
  GraduationCap,
  CalendarCheck,
  Target,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import HeroVideoSlot from '@/components/marketing/HeroVideoSlot';
import styles from './Hero.module.scss';

const trustChips = [
  { icon: <Video size={15} strokeWidth={1.75} />, label: 'שיעורי זום' },
  { icon: <Star size={15} strokeWidth={1.75} />, label: 'דירוגים וביקורות' },
  { icon: <GraduationCap size={15} strokeWidth={1.75} />, label: 'מותאם לכיתה' },
  { icon: <CalendarCheck size={15} strokeWidth={1.75} />, label: 'תוכנית יומית' },
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.brandName}>Tutorix</span> — תרגול חכם
            <br />
            לתלמידי <span className={styles.gradient}>א׳–ו׳</span> + מורים פרטיים בזום
          </h1>
          <p className={styles.subtitle}>
            תרגול חינמי בכל המקצועות עם משוב מיידי מבוסס AI.
            <br />
            צריכים ליווי אישי? הזמינו מורה פרטי לשיעור בזום — ישירות מהפלטפורמה.
          </p>
          <div className={styles.actions}>
            <Link href="/signup?role=student">
              <Button size="lg">
                התחילו בחינם
                <ArrowLeft size={18} strokeWidth={1.75} />
              </Button>
            </Link>
            <Link href="/tutors">
              <Button variant="secondary" size="lg">
                <Target size={18} strokeWidth={1.75} />
                מצא מורה פרטי
              </Button>
            </Link>
          </div>
          <p className={styles.ctaSubtext}>ללא כרטיס אשראי — פתיחה מהירה</p>
          <div className={styles.trustRow}>
            {trustChips.map((chip) => (
              <span key={chip.label} className={styles.trustChip}>
                {chip.icon}
                {chip.label}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.visual}>
          <HeroVideoSlot />
        </div>
      </div>
    </section>
  );
}
