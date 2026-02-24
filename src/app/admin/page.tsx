import { mockAdminStats } from '@/data/mock';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  Users, Wallet, Star, BookOpen, Backpack,
  GraduationCap, Clock, CheckCircle, Shield,
} from 'lucide-react';
import styles from './page.module.scss';

export default function AdminDashboard() {
  const stats = mockAdminStats;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.titleIcon}>
            <Shield size={20} strokeWidth={1.75} />
          </div>
          <div>
            <h1>לוח בקרה — אדמין</h1>
            <p>סקירה כללית של הפלטפורמה</p>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className={styles.metricsGrid}>
        <Card className={styles.metricCard}>
          <div className={styles.metricIcon} data-color="primary">
            <Users size={20} strokeWidth={1.75} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricTop}>
              <span className={styles.metricValue}>{stats.totalUsers.toLocaleString()}</span>
              <Badge variant="success" size="sm">+{stats.monthlyGrowth}%</Badge>
            </div>
            <span className={styles.metricLabel}>משתמשים רשומים</span>
          </div>
        </Card>
        <Card className={styles.metricCard}>
          <div className={styles.metricIcon} data-color="success">
            <Wallet size={20} strokeWidth={1.75} />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>₪{stats.monthlyRevenue.toLocaleString()}</span>
            <span className={styles.metricLabel}>הכנסה חודשית</span>
          </div>
        </Card>
        <Card className={styles.metricCard}>
          <div className={styles.metricIcon} data-color="warning">
            <Star size={20} strokeWidth={1.75} />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{stats.activeSubscriptions.toLocaleString()}</span>
            <span className={styles.metricLabel}>מנויים פעילים</span>
          </div>
        </Card>
        <Card className={styles.metricCard}>
          <div className={styles.metricIcon} data-color="accent">
            <BookOpen size={20} strokeWidth={1.75} />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{stats.totalLessons.toLocaleString()}</span>
            <span className={styles.metricLabel}>שיעורים פרטיים</span>
          </div>
        </Card>
      </div>

      {/* User breakdown */}
      <div className={styles.section}>
        <h2>חלוקת משתמשים</h2>
        <div className={styles.breakdownGrid}>
          <Card variant="outlined" className={styles.breakdownCard}>
            <div className={styles.breakdownIcon} data-color="primary">
              <Backpack size={20} strokeWidth={1.75} />
            </div>
            <span className={styles.breakdownValue}>{stats.totalStudents.toLocaleString()}</span>
            <span className={styles.breakdownLabel}>תלמידים</span>
          </Card>
          <Card variant="outlined" className={styles.breakdownCard}>
            <div className={styles.breakdownIcon} data-color="accent">
              <Users size={20} strokeWidth={1.75} />
            </div>
            <span className={styles.breakdownValue}>{stats.totalParents.toLocaleString()}</span>
            <span className={styles.breakdownLabel}>הורים</span>
          </Card>
          <Card variant="outlined" className={styles.breakdownCard}>
            <div className={styles.breakdownIcon} data-color="success">
              <GraduationCap size={20} strokeWidth={1.75} />
            </div>
            <span className={styles.breakdownValue}>{stats.totalTutors}</span>
            <span className={styles.breakdownLabel}>מורים</span>
          </Card>
          <Card variant="outlined" className={styles.breakdownCard}>
            <div className={styles.breakdownIcon} data-color="warning">
              <Clock size={20} strokeWidth={1.75} />
            </div>
            <span className={styles.breakdownValue}>{stats.pendingApprovals}</span>
            <span className={styles.breakdownLabel}>ממתינים לאישור</span>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <div className={styles.section}>
        <h2>גישה מהירה</h2>
        <div className={styles.quickActions}>
          <Card interactive className={styles.actionCard}>
            <div className={styles.actionIcon} data-color="primary">
              <Users size={22} strokeWidth={1.75} />
            </div>
            <h4>ניהול משתמשים</h4>
            <p>צפייה ועריכת משתמשים</p>
          </Card>
          <Card interactive className={styles.actionCard}>
            <div className={styles.actionIcon} data-color="success">
              <Wallet size={22} strokeWidth={1.75} />
            </div>
            <h4>הכנסות</h4>
            <p>מעקב הכנסות ועמלות</p>
          </Card>
          <Card interactive className={styles.actionCard}>
            <div className={styles.actionIcon} data-color="warning">
              <CheckCircle size={22} strokeWidth={1.75} />
            </div>
            <h4>אישור מורים</h4>
            <p>{stats.pendingApprovals} בקשות ממתינות</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
