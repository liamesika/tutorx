'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Calendar, BarChart3 } from 'lucide-react';
import styles from './page.module.scss';

const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'];
const hours = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

type SlotState = 'available' | 'booked' | 'empty';

const initialSchedule: Record<string, Record<string, SlotState>> = {
  'ראשון': { '16:00': 'available', '17:00': 'booked', '18:00': 'available' },
  'שני': { '15:00': 'available', '16:00': 'available' },
  'שלישי': { '16:00': 'booked', '17:00': 'available', '18:00': 'available' },
  'רביעי': { '15:00': 'available', '16:00': 'available', '17:00': 'booked' },
  'חמישי': { '14:00': 'available', '15:00': 'available' },
};

export default function CalendarPage() {
  const [schedule] = useState(initialSchedule);

  const getSlotState = (day: string, hour: string): SlotState => {
    return schedule[day]?.[hour] || 'empty';
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1><Calendar size={20} strokeWidth={1.75} /> לוח זמנים</h1>
          <p>נהלו את הזמינות שלכם לשיעורים</p>
        </div>
        <Button>שמירת שינויים</Button>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.dotAvailable}`} />
          <span>זמין</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.dotBooked}`} />
          <span>תפוס</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.dotEmpty}`} />
          <span>לא זמין</span>
        </div>
      </div>

      {/* Calendar grid */}
      <Card className={styles.calendar}>
        <div className={styles.calendarGrid}>
          {/* Header row */}
          <div className={styles.calendarCell} />
          {days.map((day) => (
            <div key={day} className={styles.calendarHeader}>
              {day}
            </div>
          ))}

          {/* Time rows */}
          {hours.map((hour) => (
            <>
              <div key={`h-${hour}`} className={styles.calendarTime}>
                {hour}
              </div>
              {days.map((day) => {
                const state = getSlotState(day, hour);
                return (
                  <button
                    key={`${day}-${hour}`}
                    className={`${styles.calendarSlot} ${styles[state]}`}
                  >
                    {state === 'booked' && <Badge variant="primary" size="sm">שיעור</Badge>}
                    {state === 'available' && <span className={styles.slotLabel}>פנוי</span>}
                  </button>
                );
              })}
            </>
          ))}
        </div>
      </Card>

      {/* Quick info */}
      <div className={styles.info}>
        <Card variant="outlined" padding="sm" className={styles.infoCard}>
          <BarChart3 size={18} strokeWidth={1.75} />
          <p>7 משבצות זמינות השבוע • 3 שיעורים מוזמנים</p>
        </Card>
      </div>
    </div>
  );
}
