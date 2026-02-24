'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Star, CheckCircle, Search, X, ChevronDown } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import StarRating from '@/components/ui/StarRating';
import type { MatchResult } from '@/lib/matching';
import styles from './page.module.scss';

const subjectNames: Record<string, string> = {
  math: 'מתמטיקה',
  hebrew: 'עברית',
  english: 'אנגלית',
  science: 'מדעים',
  history: 'היסטוריה',
  geography: 'גיאוגרפיה',
};

const sortOptions = [
  { value: 'match', label: 'התאמה' },
  { value: 'rating', label: 'דירוג' },
  { value: 'price_low', label: 'מחיר ↑' },
  { value: 'price_high', label: 'מחיר ↓' },
];

const LIMIT = 20;

export default function FeedPage() {
  const [results, setResults] = useState<MatchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('match');

  const hasFilters = subject || grade || maxPrice || minRating;

  const fetchFeed = useCallback(
    async (append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const params = new URLSearchParams();
      if (subject) params.set('subject', subject);
      if (grade) params.set('grade', grade);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (minRating) params.set('minRating', minRating);
      params.set('sort', sort);
      params.set('limit', String(LIMIT));
      params.set('offset', String(append ? offset : 0));

      try {
        const res = await fetch(`/api/feed?${params}`);
        const data = await res.json();
        if (append) {
          setResults((prev) => [...prev, ...(data.tutors ?? [])]);
        } else {
          setResults(data.tutors ?? []);
        }
        setTotal(data.total ?? 0);
        setHasMore(data.hasMore ?? false);
      } catch {
        // silent
      }
      setLoading(false);
      setLoadingMore(false);
    },
    [subject, grade, maxPrice, minRating, sort, offset]
  );

  useEffect(() => {
    setOffset(0);
    fetchFeed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, grade, maxPrice, minRating, sort]);

  const handleLoadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchFeed(true);
  };

  const resetFilters = () => {
    setSubject('');
    setGrade('');
    setMaxPrice('');
    setMinRating('');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>מצאו את המורה המושלם</h1>
        <p>מורים שמותאמים בדיוק לצרכים שלכם</p>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label>מקצוע</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">הכל</option>
            {Object.entries(subjectNames).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>כיתה</label>
          <select value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="">הכל</option>
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <option key={g} value={g}>כיתה {String.fromCharCode(0x5d0 + g - 1)}׳</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>מחיר מקסימלי</label>
          <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
            <option value="">ללא הגבלה</option>
            <option value="80">עד ₪80</option>
            <option value="100">עד ₪100</option>
            <option value="120">עד ₪120</option>
            <option value="150">עד ₪150</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>דירוג מינימלי</label>
          <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
            <option value="">הכל</option>
            <option value="4.5">4.5+</option>
            <option value="4.0">4.0+</option>
            <option value="3.5">3.5+</option>
          </select>
        </div>
        {hasFilters && (
          <button className={styles.resetBtn} onClick={resetFilters}>
            <X size={14} />
            נקה הכל
          </button>
        )}
      </div>

      {/* Sort + Count */}
      <div className={styles.sortRow}>
        <span className={styles.resultCount}>
          {loading ? '...' : `${total} מורים נמצאו`}
        </span>
        <div className={styles.sortGroup}>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.sortBtn} ${sort === opt.value ? styles.active : ''}`}
              onClick={() => setSort(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skeleton loading */}
      {loading ? (
        <div className={styles.skeletonList}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard}>
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
                <div className={styles.skeletonChip} />
              </div>
              <div className={styles.skeletonLines}>
                <div className={`${styles.skeletonLine} ${styles.w80}`} />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <Search />
          </div>
          <h3>לא נמצאו מורים</h3>
          <p>נסו לשנות את הפילטרים או לחפש מחדש</p>
          {hasFilters && (
            <button className={styles.resetBtn} onClick={resetFilters} style={{ margin: '0 auto' }}>
              <X size={14} />
              נקה פילטרים
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={styles.feedList}>
            {results.map((result) => (
              <TutorFeedCard key={result.tutor.id} result={result} />
            ))}
          </div>

          {hasMore && (
            <button className={styles.loadMore} onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? (
                'טוען...'
              ) : (
                <>
                  הצג עוד מורים
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function TutorFeedCard({ result }: { result: MatchResult }) {
  const { tutor, matchScore, compatibilityReasons } = result;

  // Collect all grade numbers from tutor subjects
  const allGrades = Array.from(
    new Set(tutor.subjects.flatMap((s) => s.grades))
  ).sort();

  return (
    <div className={styles.tutorCard}>
      <div className={styles.cardBody}>
        {/* Top row */}
        <div className={styles.cardTop}>
          <div className={styles.cardLeft}>
            <div className={styles.avatarWrap}>
              <Avatar
                name={tutor.display_name}
                src={tutor.avatar_url ?? undefined}
                size="lg"
                status={tutor.is_available ? 'online' : 'offline'}
              />
              {matchScore > 0 && (
                <span className={styles.matchBadge}>{matchScore}%</span>
              )}
            </div>
            <div className={styles.tutorCore}>
              <h3 className={styles.tutorName}>{tutor.display_name}</h3>
              <div className={styles.tutorMeta}>
                <StarRating rating={tutor.rating_avg} size="sm" />
                <span className={styles.metaItem}>
                  ({tutor.review_count})
                </span>
                {tutor.city && (
                  <span className={styles.metaItem}>
                    <MapPin size={12} /> {tutor.city}
                  </span>
                )}
              </div>
              {tutor.bio && <p className={styles.tutorBio}>{tutor.bio}</p>}
            </div>
          </div>

          <div className={styles.cardRight}>
            <div className={styles.priceTag}>
              <span className={styles.amount}>₪{tutor.hourly_rate}</span>
              <span className={styles.unit}>/שעה</span>
            </div>
            {tutor.trial_rate && (
              <span className={styles.trialBadge}>ניסיון ₪{tutor.trial_rate}</span>
            )}
          </div>
        </div>

        {/* Middle: chips */}
        <div className={styles.cardMiddle}>
          {tutor.subjects.map((s) => (
            <span key={s.subject} className={styles.chipSubject}>
              {subjectNames[s.subject] ?? s.subject}
            </span>
          ))}
          {allGrades.length > 0 && (
            <span className={styles.chipGrade}>
              כיתות {allGrades.map((g) => String.fromCharCode(0x5d0 + g - 1) + '׳').join(', ')}
            </span>
          )}
          {compatibilityReasons.map((reason, i) => (
            <span key={i} className={styles.chipReason}>
              <CheckCircle size={12} />
              {reason}
            </span>
          ))}
        </div>

        {/* CTA row */}
        <div className={styles.ctaRow}>
          <Link href={`/parent/book-tutor?tutor=${tutor.id}`} className={styles.ctaPrimary}>
            בקשת שיעור
          </Link>
          <Link href={`/tutors/${tutor.id}`} className={styles.ctaSecondary}>
            לפרופיל המורה
          </Link>
        </div>
      </div>
    </div>
  );
}
