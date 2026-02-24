import { mockTutors, mockLessons, mockEarnings } from '@/data/mock';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { Wallet, BookOpen, Star, Users, Calculator, Globe } from 'lucide-react';
import styles from './page.module.scss';

export default function TutorDashboard() {
  const tutor = mockTutors[0];
  const currentMonthEarnings = mockEarnings[mockEarnings.length - 1];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.greeting}>
          <h1>שלום, {tutor.name}!</h1>
          <p>הנה סקירת הפעילות שלך</p>
        </div>
        <Badge variant="success">
          <Star size={14} strokeWidth={1.75} />
          {tutor.rating} ({tutor.reviewCount} ביקורות)
        </Badge>
      </div>

      {/* Quick stats */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statIcon} data-color="success">
            <Wallet size={20} strokeWidth={1.75} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>₪{currentMonthEarnings.net.toLocaleString()}</span>
            <span className={styles.statLabel}>הכנסה נטו החודש</span>
          </div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statIcon} data-color="primary">
            <BookOpen size={20} strokeWidth={1.75} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{currentMonthEarnings.lessonsCount}</span>
            <span className={styles.statLabel}>שיעורים החודש</span>
          </div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statIcon} data-color="warning">
            <Star size={20} strokeWidth={1.75} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{tutor.rating}</span>
            <span className={styles.statLabel}>דירוג ממוצע</span>
          </div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statIcon} data-color="accent">
            <Users size={20} strokeWidth={1.75} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{tutor.reviewCount}</span>
            <span className={styles.statLabel}>ביקורות</span>
          </div>
        </Card>
      </div>

      {/* Upcoming lessons */}
      <div className={styles.section}>
        <h2>שיעורים קרובים</h2>
        <div className={styles.lessons}>
          {mockLessons.map((lesson) => (
            <Card key={lesson.id} className={styles.lessonCard}>
              <div className={styles.lessonLeft}>
                <Avatar name={lesson.student.name} size="md" />
                <div>
                  <h4>{lesson.student.name}</h4>
                  <p>
                    {lesson.subject === 'math' && <><Calculator size={12} strokeWidth={1.75} /> מתמטיקה</>}
                    {lesson.subject === 'english' && <><Globe size={12} strokeWidth={1.75} /> אנגלית</>}
                    {lesson.subject !== 'math' && lesson.subject !== 'english' && lesson.subject}
                  </p>
                </div>
              </div>
              <div className={styles.lessonRight}>
                <span className={styles.lessonDate}>{lesson.date}</span>
                <span className={styles.lessonTime}>{lesson.startTime} - {lesson.endTime}</span>
                <Badge variant="primary" size="sm">₪{lesson.booking.price}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Earnings overview */}
      <div className={styles.section}>
        <h2>הכנסות — 6 חודשים אחרונים</h2>
        <Card className={styles.earningsCard}>
          <div className={styles.earningsChart}>
            {mockEarnings.map((month, i) => (
              <div key={i} className={styles.earningsBar}>
                <div className={styles.earningsBarInner}>
                  <div
                    className={styles.earningsBarFill}
                    style={{ height: `${(month.net / 5000) * 100}%` }}
                  />
                </div>
                <span className={styles.earningsLabel}>{month.month}</span>
                <span className={styles.earningsValue}>₪{month.net.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
