import Link from 'next/link';
import { mockSessionResults, mockStudents, subjects as subjectList } from '@/data/mock';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import { Lightbulb, GraduationCap } from 'lucide-react';
import styles from './page.module.scss';

export default function SummaryPage() {
  const student = mockStudents[0];
  const sessions = mockSessionResults;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>סיכום התקדמות</h1>
        <p>הנה סקירה של הביצועים האחרונים שלך, {student.name}</p>
      </div>

      {/* Session cards */}
      <div className={styles.sessions}>
        {sessions.map((session) => {
          const subject = subjectList.find((s) => s.id === session.subject);
          const scorePercent = Math.round((session.correctAnswers / session.totalQuestions) * 100);

          return (
            <Card key={session.id} className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <div className={styles.sessionSubject}>
                  <span>{subject?.nameHe.charAt(0)}</span>
                  <h3>{subject?.nameHe}</h3>
                </div>
                <Badge
                  variant={scorePercent >= 80 ? 'success' : scorePercent >= 60 ? 'warning' : 'error'}
                >
                  {scorePercent}%
                </Badge>
              </div>
              <ProgressBar
                value={session.correctAnswers}
                max={session.totalQuestions}
                variant={scorePercent >= 80 ? 'success' : scorePercent >= 60 ? 'warning' : 'accent'}
                size="md"
              />
              <div className={styles.sessionStats}>
                <span>{session.correctAnswers}/{session.totalQuestions} נכונות</span>
                <span>+{session.xpEarned} XP</span>
                <span>{session.duration} דקות</span>
              </div>
              {session.weakTopics.length > 0 && (
                <div className={styles.weakTopics}>
                  <p className={styles.weakLabel}>נושאים לחיזוק:</p>
                  <div className={styles.weakTags}>
                    {session.weakTopics.map((topic, i) => (
                      <Badge key={i} variant="warning" size="sm">{topic}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Recommendations */}
      <Card className={styles.recommendations}>
        <h3><Lightbulb size={18} strokeWidth={1.75} /> המלצות AI</h3>
        <ul>
          <li>מומלץ לתרגל עוד חילוק וחלוקה לשברים במתמטיקה</li>
          <li>בעברית, כדאי להתמקד בזיהוי שורשים ובניינים</li>
          <li>נסו לשמור על רצף תרגול יומי של 15 דקות</li>
        </ul>
      </Card>

      {/* CTA */}
      <div className={styles.cta}>
        <Card className={styles.ctaCard}>
          <div className={styles.ctaContent}>
            <span className={styles.ctaIcon}><GraduationCap size={24} strokeWidth={1.75} /></span>
            <div>
              <h3>צריכים עזרה נוספת?</h3>
              <p>מורה פרטי יכול לעזור לכם להתגבר על הנושאים הקשים</p>
            </div>
            <Link href="/parent/book-tutor">
              <Button>מצאו מורה</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
