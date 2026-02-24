import { mockAdminStats, mockEarnings } from '@/data/mock';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Wallet, Banknote, CreditCard, BarChart3 } from 'lucide-react';
import styles from './page.module.scss';

export default function RevenuePage() {
  const stats = mockAdminStats;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1><Wallet size={22} strokeWidth={1.75} /> הכנסות ועמלות</h1>
        <p>מעקב אחר ההכנסות של הפלטפורמה</p>
      </div>

      {/* Revenue overview */}
      <div className={styles.overviewGrid}>
        <Card className={styles.overviewCard}>
          <span className={styles.cardIcon}><Banknote size={20} strokeWidth={1.75} /></span>
          <span className={styles.cardValue}>₪{stats.monthlyRevenue.toLocaleString()}</span>
          <span className={styles.cardLabel}>הכנסה חודשית</span>
          <Badge variant="success" size="sm">+{stats.monthlyGrowth}%</Badge>
        </Card>
        <Card className={styles.overviewCard}>
          <span className={styles.cardIcon}><CreditCard size={20} strokeWidth={1.75} /></span>
          <span className={styles.cardValue}>₪{(stats.activeSubscriptions * 49).toLocaleString()}</span>
          <span className={styles.cardLabel}>הכנסה ממנויים</span>
        </Card>
        <Card className={styles.overviewCard}>
          <span className={styles.cardIcon}><BarChart3 size={20} strokeWidth={1.75} /></span>
          <span className={styles.cardValue}>₪{mockEarnings.reduce((s, m) => s + m.commission, 0).toLocaleString()}</span>
          <span className={styles.cardLabel}>עמלות מורים (6 ח׳)</span>
        </Card>
      </div>

      {/* Revenue chart */}
      <Card className={styles.chartCard}>
        <h3>הכנסות — 6 חודשים אחרונים</h3>
        <div className={styles.chart}>
          {[
            { month: 'ספט׳', subs: 85000, commission: 12000 },
            { month: 'אוק׳', subs: 89000, commission: 13500 },
            { month: 'נוב׳', subs: 92000, commission: 11800 },
            { month: 'דצמ׳', subs: 95000, commission: 10200 },
            { month: 'ינו׳', subs: 100000, commission: 14500 },
            { month: 'פבר׳', subs: 105720, commission: 12800 },
          ].map((data, i) => (
            <div key={i} className={styles.chartCol}>
              <div className={styles.chartBars}>
                <div
                  className={styles.barSubs}
                  style={{ height: `${(data.subs / 120000) * 100}%` }}
                />
                <div
                  className={styles.barComm}
                  style={{ height: `${(data.commission / 120000) * 100}%` }}
                />
              </div>
              <span className={styles.chartLabel}>{data.month}</span>
            </div>
          ))}
        </div>
        <div className={styles.chartLegend}>
          <span><span className={styles.dotSubs} /> מנויים</span>
          <span><span className={styles.dotComm} /> עמלות</span>
        </div>
      </Card>

      {/* Subscription breakdown */}
      <div className={styles.section}>
        <h3>חלוקת מנויים</h3>
        <div className={styles.subsGrid}>
          <Card variant="outlined" className={styles.subCard}>
            <h4>חינם</h4>
            <span className={styles.subValue}>968</span>
            <span className={styles.subLabel}>משתמשים</span>
          </Card>
          <Card variant="outlined" className={styles.subCard}>
            <h4>פרימיום חודשי</h4>
            <span className={styles.subValue}>1,542</span>
            <span className={styles.subLabel}>₪49/חודש</span>
          </Card>
          <Card variant="outlined" className={styles.subCard}>
            <h4>פרימיום שנתי</h4>
            <span className={styles.subValue}>614</span>
            <span className={styles.subLabel}>₪39/חודש</span>
          </Card>
        </div>
      </div>
    </div>
  );
}
