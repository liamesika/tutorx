import Image from 'next/image';
import {
  Video, CalendarCheck, Bell, ShieldCheck,
} from 'lucide-react';
import type { ReactNode } from 'react';
import IconBox from '@/components/ui/IconBox';
import styles from './HomeZoom.module.scss';

const features: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: <CalendarCheck size={20} strokeWidth={1.75} />,
    title: 'תיאום מהיר',
    desc: 'בחרו מורה, תאריך ושעה — ותקבלו אישור מיידי.',
  },
  {
    icon: <Video size={20} strokeWidth={1.75} />,
    title: 'קישור זום אישי',
    desc: 'כל מורה עם חדר זום קבוע. קישור נשלח אוטומטית.',
  },
  {
    icon: <Bell size={20} strokeWidth={1.75} />,
    title: 'תזכורות',
    desc: 'תזכורת 15 דקות לפני השיעור — גם למורה וגם לתלמיד.',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.75} />,
    title: 'תשלום מאובטח',
    desc: 'תשלום דרך הפלטפורמה בלבד. ללא העברות ישירות.',
  },
];

export default function HomeZoom() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left: info */}
          <div className={styles.content}>
            <span className={styles.label}>שיעורי זום</span>
            <h2 className={styles.title}>
              שיעורים פרטיים <span className={styles.accent}>פנים אל פנים</span>
            </h2>
            <p className={styles.subtitle}>
              הזמינו שיעור פרטי בזום עם מורה מאומת — ישירות מהפלטפורמה. תיאום, תשלום ותזכורות — הכל אוטומטי.
            </p>
            <div className={styles.featureList}>
              {features.map((f, i) => (
                <div key={i} className={styles.featureItem}>
                  <IconBox variant="primary" size="sm">{f.icon}</IconBox>
                  <div>
                    <h4 className={styles.featureTitle}>{f.title}</h4>
                    <p className={styles.featureDesc}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: real image */}
          <div className={styles.visual}>
            <div className={styles.imageWrapper}>
              <Image
                src="/media/home/zoom-session.png"
                alt="שיעור פרטי בזום — תלמיד ומורה"
                width={520}
                height={390}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
