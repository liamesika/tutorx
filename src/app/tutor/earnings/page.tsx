import { mockEarnings, mockTutors } from '@/data/mock';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Wallet, Banknote, BarChart3, BookOpen } from 'lucide-react';
import styles from './page.module.scss';

export default function EarningsPage() {
  const tutor = mockTutors[0];
  const totalNet = mockEarnings.reduce((sum, m) => sum + m.net, 0);
  const totalCommission = mockEarnings.reduce((sum, m) => sum + m.commission, 0);
  const totalLessons = mockEarnings.reduce((sum, m) => sum + m.lessonsCount, 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1><Wallet size={20} strokeWidth={1.75} /> הכנסות</h1>
        <p>מעקב הכנסות ועמלות</p>
      </div>

      {/* Summary cards */}
      <div className={styles.summaryGrid}>
        <Card className={styles.summaryCard}>
          <span className={styles.summaryIcon}><Banknote size={20} strokeWidth={1.75} /></span>
          <span className={styles.summaryValue}>₪{totalNet.toLocaleString()}</span>
          <span className={styles.summaryLabel}>סה״כ נטו (6 חודשים)</span>
        </Card>
        <Card className={styles.summaryCard}>
          <span className={styles.summaryIcon}><BarChart3 size={20} strokeWidth={1.75} /></span>
          <span className={styles.summaryValue}>₪{totalCommission.toLocaleString()}</span>
          <span className={styles.summaryLabel}>סה״כ עמלה</span>
        </Card>
        <Card className={styles.summaryCard}>
          <span className={styles.summaryIcon}><BookOpen size={20} strokeWidth={1.75} /></span>
          <span className={styles.summaryValue}>{totalLessons}</span>
          <span className={styles.summaryLabel}>סה״כ שיעורים</span>
        </Card>
      </div>

      {/* Monthly breakdown chart */}
      <Card className={styles.chartSection}>
        <h3>הכנסות חודשיות</h3>
        <div className={styles.chart}>
          {mockEarnings.map((month, i) => (
            <div key={i} className={styles.chartBar}>
              <div className={styles.chartBarInner}>
                <div
                  className={styles.barCommission}
                  style={{ height: `${(month.commission / 6000) * 100}%` }}
                />
                <div
                  className={styles.barNet}
                  style={{ height: `${(month.net / 6000) * 100}%` }}
                />
              </div>
              <span className={styles.chartLabel}>{month.month}</span>
            </div>
          ))}
        </div>
        <div className={styles.chartLegend}>
          <span><span className={styles.legendNet} /> נטו</span>
          <span><span className={styles.legendComm} /> עמלה (15%)</span>
        </div>
      </Card>

      {/* Detailed table */}
      <div className={styles.section}>
        <h3>פירוט חודשי</h3>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>חודש</span>
            <span>שיעורים</span>
            <span>ברוטו</span>
            <span>עמלה</span>
            <span>נטו</span>
          </div>
          {mockEarnings.map((month, i) => (
            <div key={i} className={styles.tableRow}>
              <span className={styles.monthName}>{month.month}</span>
              <span>{month.lessonsCount}</span>
              <span>₪{month.gross.toLocaleString()}</span>
              <span className={styles.commission}>-₪{month.commission.toLocaleString()}</span>
              <span className={styles.netAmount}>₪{month.net.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal */}
      <Card className={styles.withdrawal}>
        <div className={styles.withdrawInfo}>
          <div>
            <h3>יתרה זמינה למשיכה</h3>
            <span className={styles.withdrawAmount}>₪{mockEarnings[mockEarnings.length - 1].net.toLocaleString()}</span>
          </div>
          <Button>בקשת משיכה</Button>
        </div>
        <div className={styles.withdrawStatus}>
          <Badge variant="success" size="sm">תשלום אחרון: 01/02/2026 — ₪4,760</Badge>
        </div>
      </Card>
    </div>
  );
}
