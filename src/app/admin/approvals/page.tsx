import { mockTutors } from '@/data/mock';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import styles from './page.module.scss';

// Simulate pending tutors
const pendingTutors = [
  {
    id: 'pt1',
    name: 'אורן דוד',
    email: 'oren@example.com',
    bio: 'מורה למתמטיקה עם 5 שנות ניסיון. בוגר אוניברסיטת תל אביב.',
    subjects: ['מתמטיקה'],
    grades: ['כיתה ד׳', 'כיתה ה׳', 'כיתה ו׳'],
    hourlyRate: 100,
    experience: 5,
    appliedAt: '2026-02-18',
  },
  {
    id: 'pt2',
    name: 'שרה לוי',
    email: 'sara@example.com',
    bio: 'מורה לאנגלית עם תעודת TEFL. גרתי 3 שנים באנגליה.',
    subjects: ['אנגלית'],
    grades: ['כיתה א׳', 'כיתה ב׳', 'כיתה ג׳'],
    hourlyRate: 110,
    experience: 7,
    appliedAt: '2026-02-17',
  },
  {
    id: 'pt3',
    name: 'מוחמד חסן',
    email: 'muhammad@example.com',
    bio: 'סטודנט למדעי המחשב שמלמד מתמטיקה ומדעים. מומחה בהוראה דיגיטלית.',
    subjects: ['מתמטיקה', 'מדעים'],
    grades: ['כיתה ג׳', 'כיתה ד׳', 'כיתה ה׳'],
    hourlyRate: 85,
    experience: 2,
    appliedAt: '2026-02-16',
  },
];

export default function ApprovalsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1><CheckCircle size={22} strokeWidth={1.75} /> אישור מורים</h1>
        <p>{pendingTutors.length} בקשות ממתינות לאישור</p>
      </div>

      <div className={styles.list}>
        {pendingTutors.map((tutor) => (
          <Card key={tutor.id} className={styles.approvalCard}>
            <div className={styles.cardHeader}>
              <Avatar name={tutor.name} size="lg" />
              <div className={styles.cardInfo}>
                <h3>{tutor.name}</h3>
                <p className={styles.email}>{tutor.email}</p>
                <p className={styles.date}>הגשה: {tutor.appliedAt}</p>
              </div>
              <Badge variant="warning">ממתין</Badge>
            </div>

            <p className={styles.bio}>{tutor.bio}</p>

            <div className={styles.details}>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>מקצועות:</span>
                <div className={styles.tags}>
                  {tutor.subjects.map((s, i) => (
                    <Badge key={i} variant="primary" size="sm">{s}</Badge>
                  ))}
                </div>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>כיתות:</span>
                <div className={styles.tags}>
                  {tutor.grades.map((g, i) => (
                    <Badge key={i} variant="default" size="sm">{g}</Badge>
                  ))}
                </div>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>מחיר:</span>
                <span>₪{tutor.hourlyRate}/שעה</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>ניסיון:</span>
                <span>{tutor.experience} שנים</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Button variant="primary">אישור</Button>
              <Button variant="danger">דחייה</Button>
              <Button variant="ghost">פרטים נוספים</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Approved stats */}
      <Card variant="outlined" className={styles.statsCard}>
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{mockTutors.length}</span>
            <span className={styles.statLabel}>מורים מאושרים</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{pendingTutors.length}</span>
            <span className={styles.statLabel}>ממתינים</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>92%</span>
            <span className={styles.statLabel}>שיעור אישור</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
