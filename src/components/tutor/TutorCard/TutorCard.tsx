import Link from 'next/link';
import type { Tutor } from '@/types';
import { subjects as subjectList } from '@/data/mock';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import { Wallet, Calendar } from 'lucide-react';
import styles from './TutorCard.module.scss';

interface TutorCardProps {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const subjectNames = tutor.subjects.map(
    (s) => subjectList.find((sub) => sub.id === s)?.nameHe || s
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Avatar name={tutor.name} size="lg" status={tutor.isAvailable ? 'online' : 'offline'} />
        <div className={styles.info}>
          <h3 className={styles.name}>{tutor.name}</h3>
          <div className={styles.rating}>
            <StarRating rating={tutor.rating} size="sm" />
            <span className={styles.reviews}>({tutor.reviewCount} ביקורות)</span>
          </div>
        </div>
      </div>
      <p className={styles.bio}>{tutor.bio}</p>
      <div className={styles.tags}>
        {subjectNames.map((name, i) => (
          <Badge key={i} variant="primary" size="sm">{name}</Badge>
        ))}
      </div>
      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}><Wallet size={16} strokeWidth={1.75} /></span>
          <span>₪{tutor.hourlyRate}/שעה</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}><Calendar size={16} strokeWidth={1.75} /></span>
          <span>{tutor.experience} שנות ניסיון</span>
        </div>
      </div>
      <Link href={`/parent/book-tutor?tutor=${tutor.id}`}>
        <Button variant={tutor.isAvailable ? 'primary' : 'secondary'} fullWidth>
          {tutor.isAvailable ? 'הזמינו שיעור' : 'לא זמין כרגע'}
        </Button>
      </Link>
    </div>
  );
}
