import Link from 'next/link';
import { mockStudents, mockWeeklyReport, mockLessons, subjects as subjectList, gradeNames } from '@/data/mock';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import { GraduationCap, Flame, FileText, Target, Zap, Clock } from 'lucide-react';
import styles from './page.module.scss';

export default function ParentDashboard() {
  const report = mockWeeklyReport;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>שלום, רונית!</h1>
          <p>הנה סקירת ההתקדמות של הילדים שלך השבוע</p>
        </div>
        <Link href="/parent/book-tutor">
          <Button>
            <GraduationCap size={18} strokeWidth={1.75} />
            הזמינו מורה
          </Button>
        </Link>
      </div>

      {/* Children cards */}
      <div className={styles.section}>
        <h2>הילדים שלי</h2>
        <div className={styles.childrenGrid}>
          {mockStudents.map((student) => (
            <Card key={student.id} className={styles.childCard}>
              <div className={styles.childHeader}>
                <Avatar name={student.name} size="lg" />
                <div>
                  <h3>{student.name}</h3>
                  <p>{gradeNames[student.grade]}</p>
                </div>
                <Badge variant="primary">Level {student.level}</Badge>
              </div>
              <div className={styles.childStats}>
                <div className={styles.childStat}>
                  <span className={styles.childStatValue}>{student.xp.toLocaleString()}</span>
                  <span className={styles.childStatLabel}>XP</span>
                </div>
                <div className={styles.childStat}>
                  <span className={styles.childStatValue}>
                    <Flame size={14} strokeWidth={1.75} className={styles.streakIcon} />
                    {student.streak}
                  </span>
                  <span className={styles.childStatLabel}>רצף</span>
                </div>
                <div className={styles.childStat}>
                  <span className={styles.childStatValue}>{student.subjects.length}</span>
                  <span className={styles.childStatLabel}>מקצועות</span>
                </div>
              </div>
              <ProgressBar
                value={student.xp % 500}
                max={500}
                label="התקדמות לרמה הבאה"
                showValue
                variant="accent"
                size="sm"
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Weekly summary */}
      <div className={styles.section}>
        <h2>סיכום שבועי</h2>
        <div className={styles.weeklyGrid}>
          <Card className={styles.weeklyCard}>
            <div className={styles.weeklyIcon} data-color="primary">
              <FileText size={20} strokeWidth={1.75} />
            </div>
            <span className={styles.weeklyValue}>{report.totalExercises}</span>
            <span className={styles.weeklyLabel}>תרגילים</span>
          </Card>
          <Card className={styles.weeklyCard}>
            <div className={styles.weeklyIcon} data-color="accent">
              <Target size={20} strokeWidth={1.75} />
            </div>
            <span className={styles.weeklyValue}>{report.averageScore}%</span>
            <span className={styles.weeklyLabel}>ממוצע</span>
          </Card>
          <Card className={styles.weeklyCard}>
            <div className={styles.weeklyIcon} data-color="warning">
              <Zap size={20} strokeWidth={1.75} />
            </div>
            <span className={styles.weeklyValue}>{report.xpEarned}</span>
            <span className={styles.weeklyLabel}>XP</span>
          </Card>
          <Card className={styles.weeklyCard}>
            <div className={styles.weeklyIcon} data-color="success">
              <Clock size={20} strokeWidth={1.75} />
            </div>
            <span className={styles.weeklyValue}>{report.timeSpent}</span>
            <span className={styles.weeklyLabel}>דקות</span>
          </Card>
        </div>
      </div>

      {/* Recommendations */}
      <div className={styles.section}>
        <h2>המלצות</h2>
        <div className={styles.recommendations}>
          {report.recommendations.map((rec, i) => (
            <Card key={i} variant="outlined" padding="sm" className={styles.recCard}>
              <p>{rec}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming lessons */}
      <div className={styles.section}>
        <h2>שיעורים קרובים</h2>
        <div className={styles.lessons}>
          {mockLessons.map((lesson) => {
            const subject = subjectList.find((s) => s.id === lesson.subject);
            return (
              <Card key={lesson.id} className={styles.lessonCard}>
                <div className={styles.lessonInfo}>
                  <Avatar name={lesson.tutor.name} size="md" />
                  <div>
                    <h4>{lesson.tutor.name}</h4>
                    <p>{subject?.nameHe} • {lesson.date} • {lesson.startTime}-{lesson.endTime}</p>
                  </div>
                </div>
                <Badge variant="primary">₪{lesson.booking.price}</Badge>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
