'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Star, ArrowLeft, Users,
  GraduationCap, BookOpen,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import styles from './HomeTutorPreview.module.scss';

interface TutorPreview {
  id: string;
  display_name: string;
  avatar_url: string | null;
  city: string | null;
  hourly_rate: number;
  rating_avg: number;
  review_count: number;
  subjects: string[];
  is_featured?: boolean;
}

const subjectNames: Record<string, string> = {
  math: 'מתמטיקה',
  hebrew: 'עברית',
  english: 'אנגלית',
  science: 'מדעים',
  history: 'היסטוריה',
  geography: 'גיאוגרפיה',
};

export default function HomeTutorPreview() {
  const [tutors, setTutors] = useState<TutorPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/feed?limit=6&public=true')
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        if (data.tutors?.length > 0) {
          setTutors(data.tutors.slice(0, 6).map((t: Record<string, unknown>) => ({
            id: t.id,
            display_name: t.display_name,
            avatar_url: t.avatar_url,
            city: t.city,
            hourly_rate: t.hourly_rate,
            rating_avg: t.rating_avg,
            review_count: t.review_count,
            subjects: (t.subjects as Array<{ subject: string }>)?.map((s) => s.subject) || [],
            is_featured: t.is_featured,
          })));
        }
      })
      .catch(() => { /* No tutors available */ })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={styles.section} aria-labelledby="tutors-heading">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>מורים פרטיים</span>
          <h2 className={styles.title} id="tutors-heading">
            מורים פרטיים <span className={styles.accent}>זמינים עכשיו</span>
          </h2>
          <p className={styles.subtitle}>כל המורים מאומתים, עם דירוגים וביקורות אמיתיות</p>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeleton}>
                <div className={styles.skeletonRow}>
                  <div className={styles.skeletonCircle} />
                  <div className={styles.skeletonLines}>
                    <div className={`${styles.skeletonLine} ${styles.w60}`} />
                    <div className={`${styles.skeletonLine} ${styles.w40}`} />
                  </div>
                </div>
                <div className={styles.skeletonChips}>
                  <div className={styles.skeletonChip} />
                  <div className={styles.skeletonChip} />
                </div>
                <div className={`${styles.skeletonLine} ${styles.w100}`} />
              </div>
            ))}
          </div>
        ) : tutors.length > 0 ? (
          <>
            <div className={styles.grid}>
              {tutors.map((tutor) => (
                <div key={tutor.id} className={`${styles.card} ${tutor.is_featured ? styles.featuredCard : ''}`}>
                  {tutor.is_featured && (
                    <span className={styles.featuredBadge}>
                      <Star size={11} />
                      מורה מומלץ
                    </span>
                  )}
                  <div className={styles.cardTop}>
                    <Avatar name={tutor.display_name} src={tutor.avatar_url ?? undefined} size="md" />
                    <div className={styles.info}>
                      <h3 className={styles.name}>{tutor.display_name}</h3>
                      <div className={styles.meta}>
                        {tutor.city && (
                          <span className={styles.metaItem}>
                            <MapPin size={13} />
                            {tutor.city}
                          </span>
                        )}
                        <span className={styles.metaItem}>
                          <Star size={13} />
                          {tutor.rating_avg.toFixed(1)} ({tutor.review_count})
                        </span>
                      </div>
                    </div>
                    <div className={styles.price}>
                      <span className={styles.priceAmount}>₪{tutor.hourly_rate}</span>
                      <span className={styles.priceUnit}>/שעה</span>
                    </div>
                  </div>
                  <div className={styles.subjects}>
                    {tutor.subjects.map((s) => (
                      <span key={s} className={styles.subjectChip}>
                        {subjectNames[s] ?? s}
                      </span>
                    ))}
                  </div>
                  <div className={styles.cardActions}>
                    <Link href={`/tutors/${tutor.id}`} className={styles.ctaSecondary}>
                      לפרופיל
                    </Link>
                    <Link href={`/parent/book-tutor?tutor=${tutor.id}`} className={styles.ctaPrimary}>
                      בקשת שיעור
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.viewAll}>
              <Link href="/tutors">
                <Button variant="secondary" size="lg">
                  <Users size={18} strokeWidth={1.75} />
                  כל המורים הפרטיים
                  <ArrowLeft size={16} />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyImage}>
              <Image
                src="/media/home/verified-tutors.png"
                alt="מורים פרטיים מאומתים"
                width={400}
                height={260}
                className={styles.emptyImg}
                sizes="(max-width: 768px) 90vw, 400px"
              />
            </div>
            <h3 className={styles.emptyTitle}>עדיין אין מורים זמינים כרגע</h3>
            <p className={styles.emptyDesc}>
              אבל אפשר להתחיל לתרגל בחינם עכשיו — ולהזמין מורה כשיהיו זמינים
            </p>
            <div className={styles.emptyActions}>
              <Link href="/signup?role=student">
                <Button size="lg">התחילו בחינם</Button>
              </Link>
              <Link href="/signup?role=tutor">
                <Button variant="secondary" size="lg">
                  <BookOpen size={18} strokeWidth={1.75} />
                  הרשמת מורה לפלטפורמה
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
