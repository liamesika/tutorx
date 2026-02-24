import { mockProgressData, mockWeeklyReport, mockStudents, subjects as subjectList } from '@/data/mock';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { BarChart3, Bot, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import styles from './page.module.scss';

export default function AnalyticsPage() {
  const report = mockWeeklyReport;
  const student = mockStudents[0];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1><BarChart3 size={22} strokeWidth={1.75} /> ניתוח התקדמות</h1>
        <p>ניתוח מפורט של הביצועים של {student.name}</p>
      </div>

      {/* Progress chart (simplified visual) */}
      <Card className={styles.chartCard}>
        <h3>ציונים שבועיים</h3>
        <div className={styles.chart}>
          {mockProgressData.map((data, i) => (
            <div key={i} className={styles.chartBar}>
              <div className={styles.chartBarInner}>
                <div
                  className={styles.chartBarFill}
                  style={{ height: `${data.score}%` }}
                />
              </div>
              <span className={styles.chartLabel}>
                {new Date(data.date).toLocaleDateString('he-IL', { weekday: 'short' })}
              </span>
              <span className={styles.chartValue}>{data.score}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Subject breakdown */}
      <div className={styles.section}>
        <h2>ביצועים לפי מקצוע</h2>
        <div className={styles.subjectsGrid}>
          {student.subjects.map((subjectId) => {
            const subject = subjectList.find((s) => s.id === subjectId);
            const isStrong = report.strongSubjects.includes(subjectId);
            const score = isStrong ? 85 : 62;

            return (
              <Card key={subjectId} className={styles.subjectCard}>
                <div className={styles.subjectHeader}>
                  <span className={styles.subjectIcon}>{subject?.nameHe.charAt(0)}</span>
                  <h4>{subject?.nameHe}</h4>
                  <Badge variant={isStrong ? 'success' : 'warning'} size="sm">
                    {isStrong ? 'חזק' : 'לחיזוק'}
                  </Badge>
                </div>
                <ProgressBar
                  value={score}
                  max={100}
                  showValue
                  variant={isStrong ? 'success' : 'warning'}
                />
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Insights */}
      <div className={styles.section}>
        <h2><Bot size={20} strokeWidth={1.75} /> תובנות AI</h2>
        <div className={styles.insights}>
          <Card variant="outlined" className={styles.insightCard}>
            <div className={styles.insightIcon}><TrendingUp size={18} strokeWidth={1.75} /></div>
            <div>
              <h4>מגמה חיובית במתמטיקה</h4>
              <p>הציונים במתמטיקה עלו ב-12% בשבועיים האחרונים. ההתמקדות בחילוק מניבה תוצאות.</p>
            </div>
          </Card>
          <Card variant="outlined" className={styles.insightCard}>
            <div className={styles.insightIcon}><AlertTriangle size={18} strokeWidth={1.75} /></div>
            <div>
              <h4>עברית דורשת תשומת לב</h4>
              <p>הביצועים בעברית ירדו מעט. מומלץ להוסיף 10 דקות תרגול יומי בנושא שורשים.</p>
            </div>
          </Card>
          <Card variant="outlined" className={styles.insightCard}>
            <div className={styles.insightIcon}><Lightbulb size={18} strokeWidth={1.75} /></div>
            <div>
              <h4>הזמן האופטימלי ללמידה</h4>
              <p>יואב מפגין את הביצועים הטובים ביותר בין 16:00-17:00. מומלץ לתרגל בשעות אלו.</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Weekly comparison */}
      <Card className={styles.comparison}>
        <h3>השוואה שבועית</h3>
        <div className={styles.comparisonGrid}>
          <div className={styles.comparisonItem}>
            <span className={styles.compLabel}>תרגילים</span>
            <span className={styles.compValue}>42</span>
            <Badge variant="success" size="sm">+8 מהשבוע שעבר</Badge>
          </div>
          <div className={styles.comparisonItem}>
            <span className={styles.compLabel}>ציון ממוצע</span>
            <span className={styles.compValue}>77%</span>
            <Badge variant="success" size="sm">+5% מהשבוע שעבר</Badge>
          </div>
          <div className={styles.comparisonItem}>
            <span className={styles.compLabel}>זמן למידה</span>
            <span className={styles.compValue}>3 שעות</span>
            <Badge variant="warning" size="sm">-30 דקות</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
