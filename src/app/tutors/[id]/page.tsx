'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Avatar from '@/components/ui/Avatar';
import StarRating from '@/components/ui/StarRating';
import {
  MapPin,
  GraduationCap,
  BookOpen,
  Sparkles,
  Heart,
  Calendar,
  Star,
  MessageSquare,
  CalendarPlus,
  BadgeCheck,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import styles from './page.module.scss';

const dayNames: Record<number, string> = {
  0: 'ראשון', 1: 'שני', 2: 'שלישי', 3: 'רביעי', 4: 'חמישי', 5: 'שישי', 6: 'שבת',
};

const subjectNames: Record<string, string> = {
  math: 'מתמטיקה', hebrew: 'עברית', english: 'אנגלית',
  science: 'מדעים', history: 'היסטוריה', geography: 'גיאוגרפיה',
};

interface TutorData {
  id: string;
  display_name: string;
  avatar_url: string | null;
  cover_image_url: string | null;
  bio: string | null;
  city: string | null;
  hourly_rate: number;
  trial_rate: number | null;
  rating_avg: number;
  review_count: number;
  experience: number;
  is_available: boolean;
  video_intro_url: string | null;
  subjects: Array<{ subject: string; grades: number[] }>;
  strengths: Array<{ subject: string; topic_name: string; strength: number; is_weak: boolean }>;
  interests: Array<{ id: string; name_he: string; icon: string | null }>;
  slots: Array<{ day_of_week: number; start_time: string; end_time: string }>;
  reviews: Array<{
    id: string;
    rating: number;
    text: string | null;
    created_at: string;
    profiles: { full_name: string; avatar_url: string | null };
  }>;
}

export default function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tutor, setTutor] = useState<TutorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/tutors/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { setTutor(data.tutor); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.skeleton}>
          <div className={styles.skeletonCover} />
          <div className={styles.skeletonRow}>
            <div className={`${styles.skeletonBlock} ${styles.w50} ${styles.h40}`} />
            <div className={`${styles.skeletonBlock} ${styles.w30} ${styles.h40}`} />
          </div>
          <div className={styles.skeletonSection}>
            <div className={`${styles.skeletonBlock} ${styles.w80}`} />
            <div className={`${styles.skeletonBlock} ${styles.w100}`} />
            <div className={`${styles.skeletonBlock} ${styles.w80}`} />
          </div>
          <div className={styles.skeletonSection}>
            <div className={`${styles.skeletonBlock} ${styles.w50}`} />
            <div className={`${styles.skeletonBlock} ${styles.w30}`} />
          </div>
        </div>
      </>
    );
  }

  if (error || !tutor) {
    return (
      <>
        <Navbar />
        <div className={styles.errorPage}>
          <div className={styles.errorIconWrap}>
            <AlertCircle />
          </div>
          <h2 className={styles.errorTitle}>מורה לא נמצא</h2>
          <p className={styles.errorDesc}>ייתכן שהפרופיל אינו זמין כרגע</p>
          <Link href="/tutors" className={styles.errorLink}>
            <ArrowRight size={16} />
            חזרה לרשימת המורים
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const formatTime = (t: string) => t.slice(0, 5);
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        {/* Cover + Avatar */}
        <div className={styles.hero}>
          <div className={styles.cover}>
            {tutor.cover_image_url && <img src={tutor.cover_image_url} alt="" />}
          </div>
          <div className={styles.avatarBlock}>
            <div className={styles.avatarRing}>
              <Avatar name={tutor.display_name} src={tutor.avatar_url ?? undefined} size="xl" />
            </div>
            <span className={`${styles.availDot} ${tutor.is_available ? styles.online : styles.offline}`} />
          </div>
        </div>

        {/* Header */}
        <div className={styles.profileHeader}>
          <div className={styles.nameBlock}>
            <h1 className={styles.name}>{tutor.display_name}</h1>
            <div className={styles.metaRow}>
              <StarRating rating={tutor.rating_avg} size="sm" />
              <span className={styles.metaItem}>({tutor.review_count} ביקורות)</span>
              {tutor.city && (
                <span className={styles.metaItem}><MapPin size={14} /> {tutor.city}</span>
              )}
              {tutor.experience > 0 && (
                <span className={styles.metaItem}><GraduationCap size={14} /> {tutor.experience} שנות ניסיון</span>
              )}
            </div>
          </div>
          <div className={styles.priceBlock}>
            <span className={styles.mainPrice}>₪{tutor.hourly_rate}</span>
            <span className={styles.pricePer}>/שעה</span>
            {tutor.trial_rate && <span className={styles.trialPrice}>שיעור ניסיון ₪{tutor.trial_rate}</span>}
          </div>
        </div>

        {/* CTA (desktop) */}
        <div className={styles.ctaRow}>
          <Link href={`/parent/book-tutor?tutor=${tutor.id}`} className={`${styles.ctaBtn} ${styles.primary}`}>
            <CalendarPlus size={18} />
            הזמינו שיעור
          </Link>
          <button className={`${styles.ctaBtn} ${styles.secondary}`}>
            <MessageSquare size={18} />
            שלחו הודעה
          </button>
        </div>

        {/* Bio */}
        {tutor.bio && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}><BookOpen /></div>
              <h2 className={styles.sectionTitle}>קצת עליי</h2>
            </div>
            <p className={styles.bio}>{tutor.bio}</p>
          </div>
        )}

        {/* Subjects */}
        {tutor.subjects.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}><BookOpen /></div>
              <h2 className={styles.sectionTitle}>מקצועות</h2>
            </div>
            <div className={styles.subjectGrid}>
              {tutor.subjects.map((s) => (
                <div key={s.subject} className={styles.subjectCard}>
                  <span className={styles.subjectName}>{subjectNames[s.subject] ?? s.subject}</span>
                  <span className={styles.subjectGrades}>
                    כיתות: {s.grades.map((g) => String.fromCharCode(0x5d0 + g - 1) + '׳').join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths */}
        {tutor.strengths.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}><Sparkles /></div>
              <h2 className={styles.sectionTitle}>חוזקות בנושאים</h2>
            </div>
            <div className={styles.strengthGrid}>
              {tutor.strengths.map((s, i) => (
                <div key={i} className={`${styles.strengthChip} ${s.is_weak ? styles.weak : styles.strong}`}>
                  <span>{subjectNames[s.subject] ?? s.subject} — {s.topic_name}</span>
                  <span className={styles.strengthDots}>
                    {[1, 2, 3, 4, 5].map((v) => (
                      <span key={v} className={`${styles.dot} ${v <= s.strength ? styles.filled : ''}`} />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {tutor.interests.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}><Heart /></div>
              <h2 className={styles.sectionTitle}>תחביבים ותחומי עניין</h2>
            </div>
            <div className={styles.interestGrid}>
              {tutor.interests.map((tag) => (
                <span key={tag.id} className={styles.interestChip}>
                  {tag.icon} {tag.name_he}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
        {tutor.slots.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}><Calendar /></div>
              <h2 className={styles.sectionTitle}>זמינות</h2>
            </div>
            <div className={styles.slotGrid}>
              {tutor.slots.map((slot, i) => (
                <div key={i} className={styles.slotCard}>
                  <div className={styles.slotDay}>יום {dayNames[slot.day_of_week]}</div>
                  <div className={styles.slotTime}>{formatTime(slot.start_time)} — {formatTime(slot.end_time)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {tutor.video_intro_url && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}><BookOpen /></div>
              <h2 className={styles.sectionTitle}>סרטון היכרות</h2>
            </div>
            <video
              src={tutor.video_intro_url}
              controls
              style={{ width: '100%', borderRadius: 'var(--radius, 16px)', maxHeight: 400 }}
            />
          </div>
        )}

        {/* Reviews */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}><Star /></div>
            <h2 className={styles.sectionTitle}>ביקורות</h2>
          </div>

          <div className={styles.reviewsHeader}>
            <div className={styles.reviewSummary}>
              <span className={styles.bigRating}>{tutor.rating_avg.toFixed(1)}</span>
              <div className={styles.ratingMeta}>
                <StarRating rating={tutor.rating_avg} size="md" showValue={false} />
                <span className={styles.reviewCount}>{tutor.review_count} ביקורות</span>
              </div>
            </div>
          </div>

          {tutor.reviews.length > 0 ? (
            <div className={styles.reviewsList}>
              {tutor.reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewTop}>
                    <Avatar
                      name={review.profiles?.full_name ?? 'אנונימי'}
                      src={review.profiles?.avatar_url ?? undefined}
                      size="sm"
                    />
                    <div className={styles.reviewAuthorInfo}>
                      <span className={styles.authorName}>
                        {review.profiles?.full_name ?? 'אנונימי'}
                        <BadgeCheck size={14} className={styles.verifiedBadge} />
                      </span>
                      <span className={styles.reviewDate}>{formatDate(review.created_at)}</span>
                    </div>
                    <StarRating rating={review.rating} size="sm" showValue={false} />
                  </div>
                  {review.text && <p className={styles.reviewText}>{review.text}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyReviews}>אין ביקורות עדיין</div>
          )}
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className={styles.stickyCtaMobile}>
        <Link href={`/parent/book-tutor?tutor=${tutor.id}`} className={`${styles.stickyCta} ${styles.primary}`}>
          <CalendarPlus size={16} />
          הזמינו שיעור
        </Link>
        <button className={`${styles.stickyCta} ${styles.secondary}`}>
          <MessageSquare size={16} />
          הודעה
        </button>
      </div>

      <Footer />
    </>
  );
}
