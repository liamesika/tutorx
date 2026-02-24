'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CalendarCheck, Target, Flame, Clock, Play,
  RefreshCw, Minus, Plus, ToggleLeft, ToggleRight,
  Zap, TrendingUp, CheckCircle2, Circle, Loader2
} from 'lucide-react';
import styles from './page.module.scss';

const subjectNamesHe: Record<string, string> = {
  math: 'מתמטיקה',
  hebrew: 'עברית',
  english: 'אנגלית',
  science: 'מדעים',
  history: 'היסטוריה',
  geography: 'גיאוגרפיה',
};

const subjectColors: Record<string, string> = {
  math: '#2563EB',
  hebrew: '#7C3AED',
  english: '#06B6D4',
  science: '#10B981',
  history: '#F59E0B',
  geography: '#F43F5E',
};

const difficultyLabels: Record<string, string> = {
  easy: 'קל',
  medium: 'בינוני',
  hard: 'מאתגר',
};

interface PlanItem {
  id: string;
  subject: string;
  topic: string;
  target_minutes: number;
  completed_minutes: number;
  priority_score: number;
  status: string;
  difficulty: string;
  reason: string;
  reason_type: string;
  sort_order: number;
}

interface Plan {
  id: string;
  plan_date: string;
  total_minutes: number;
  completed_minutes: number;
  status: string;
  items: PlanItem[];
}

interface HistoryDay {
  plan_date: string;
  completed_minutes: number;
  total_minutes: number;
  status: string;
}

function ProgressRing({ value, max, size = 120, strokeWidth = 10 }: { value: number; max: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference - percentage * circumference;

  return (
    <div className={styles.ringContainer}>
      <svg width={size} height={size} className={styles.ring}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      <div className={styles.ringContent}>
        <span className={styles.ringValue}>{value}</span>
        <span className={styles.ringLabel}>/{max} דקות</span>
      </div>
    </div>
  );
}

export default function DailyPlanPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [goal, setGoal] = useState({ minutes_per_day: 30, auto_plan_enabled: true });
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0 });
  const [history, setHistory] = useState<HistoryDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    try {
      const res = await fetch('/api/daily-plan');
      const data = await res.json();
      setPlan(data.plan);
      setGoal(data.goal);
      setStreak(data.streak);
      setHistory(data.history || []);
    } catch (err) {
      console.error('Failed to fetch plan:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const generatePlan = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/daily-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minutesPerDay: goal.minutes_per_day, autoPlanEnabled: goal.auto_plan_enabled }),
      });
      const data = await res.json();
      setPlan(data.plan);
      if (data.goal) setGoal(data.goal);
    } catch (err) {
      console.error('Failed to generate plan:', err);
    } finally {
      setGenerating(false);
    }
  };

  const completeItem = async (itemId: string, targetMinutes: number) => {
    setCompletingId(itemId);
    try {
      const res = await fetch('/api/daily-plan/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, completedMinutes: targetMinutes }),
      });
      const data = await res.json();
      if (data.success && plan) {
        setPlan({
          ...plan,
          completed_minutes: data.completedMinutes,
          status: data.allDone ? 'completed' : 'active',
          items: plan.items.map(item =>
            item.id === itemId ? { ...item, status: 'completed', completed_minutes: targetMinutes } : item
          ),
        });
        if (data.allDone) {
          setStreak(prev => ({ ...prev, current_streak: prev.current_streak + 1 }));
        }
      }
    } catch (err) {
      console.error('Failed to complete item:', err);
    } finally {
      setCompletingId(null);
    }
  };

  const updateGoal = async (newMinutes: number) => {
    const clamped = Math.max(15, Math.min(120, newMinutes));
    setGoal(prev => ({ ...prev, minutes_per_day: clamped }));
    try {
      await fetch('/api/daily-plan/goal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minutesPerDay: clamped, autoPlanEnabled: goal.auto_plan_enabled }),
      });
    } catch (err) {
      console.error('Failed to update goal:', err);
    }
  };

  const toggleAutoPlan = async () => {
    const newValue = !goal.auto_plan_enabled;
    setGoal(prev => ({ ...prev, auto_plan_enabled: newValue }));
    try {
      await fetch('/api/daily-plan/goal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minutesPerDay: goal.minutes_per_day, autoPlanEnabled: newValue }),
      });
    } catch (err) {
      console.error('Failed to toggle auto plan:', err);
    }
  };

  // Group items by subject
  const groupedItems = plan?.items?.reduce((acc, item) => {
    if (!acc[item.subject]) acc[item.subject] = [];
    acc[item.subject].push(item);
    return acc;
  }, {} as Record<string, PlanItem[]>) || {};

  const completedMinutes = plan?.completed_minutes || 0;
  const totalMinutes = plan?.total_minutes || goal.minutes_per_day;

  // Fill history to 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const day = history.find(h => h.plan_date === dateStr);
    return {
      date: dateStr,
      dayName: d.toLocaleDateString('he-IL', { weekday: 'short' }),
      status: day ? (day.status === 'completed' ? 'completed' : day.completed_minutes > 0 ? 'partial' : 'none') : 'none',
    };
  });

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>
          <Loader2 size={32} className={styles.spinner} />
          <p>טוען תוכנית...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            <CalendarCheck size={28} />
            תוכנית יומית
          </h1>
          <p className={styles.pageDesc}>התוכנית שלך להיום — מותאמת אישית לפי ההתקדמות שלך</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {/* Goal Card */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrap} data-color="primary">
            <Target size={22} />
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>יעד יומי</span>
            <div className={styles.goalControl}>
              <button className={styles.goalBtn} onClick={() => updateGoal(goal.minutes_per_day - 5)} disabled={goal.minutes_per_day <= 15}>
                <Minus size={16} />
              </button>
              <span className={styles.goalValue}>{goal.minutes_per_day} דקות</span>
              <button className={styles.goalBtn} onClick={() => updateGoal(goal.minutes_per_day + 5)} disabled={goal.minutes_per_day >= 120}>
                <Plus size={16} />
              </button>
            </div>
            <button className={styles.autoToggle} onClick={toggleAutoPlan}>
              {goal.auto_plan_enabled ? <ToggleRight size={20} className={styles.toggleOn} /> : <ToggleLeft size={20} />}
              <span>תוכנית אוטומטית</span>
            </button>
          </div>
        </div>

        {/* Progress Ring */}
        <div className={styles.kpiCard}>
          <ProgressRing value={completedMinutes} max={totalMinutes} />
        </div>

        {/* Streak Card */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrap} data-color="warning">
            <Flame size={22} />
          </div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiLabel}>רצף ימים</span>
            <div className={styles.streakValue}>
              <span className={styles.streakNumber}>{streak.current_streak}</span>
              <Zap size={20} className={styles.streakIcon} />
            </div>
            <span className={styles.streakRecord}>
              <TrendingUp size={14} />
              שיא: {streak.longest_streak} ימים
            </span>
          </div>
        </div>
      </div>

      {/* History */}
      <div className={styles.historySection}>
        <span className={styles.historyLabel}>השבוע שלי</span>
        <div className={styles.historyDots}>
          {last7Days.map((day) => (
            <div key={day.date} className={styles.historyDay}>
              <div className={`${styles.historyDot} ${styles[`dot_${day.status}`]}`}>
                {day.status === 'completed' && <CheckCircle2 size={14} />}
                {day.status === 'partial' && <Circle size={14} />}
              </div>
              <span className={styles.historyDayName}>{day.dayName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Items */}
      <div className={styles.planSection}>
        <div className={styles.planHeader}>
          <h2 className={styles.sectionTitle}>
            <Clock size={20} />
            התוכנית של היום
          </h2>
          <button className={styles.refreshBtn} onClick={generatePlan} disabled={generating}>
            <RefreshCw size={16} className={generating ? styles.spinner : ''} />
            {generating ? 'מייצר...' : 'רענון תוכנית'}
          </button>
        </div>

        {!plan || !plan.items?.length ? (
          <div className={styles.emptyState}>
            <CalendarCheck size={48} className={styles.emptyIcon} />
            <h3>אין תוכנית להיום</h3>
            <p>לחצו על הכפתור ליצירת תוכנית לימוד מותאמת אישית</p>
            <button className={styles.generateBtn} onClick={generatePlan} disabled={generating}>
              {generating ? <Loader2 size={18} className={styles.spinner} /> : <Play size={18} />}
              {generating ? 'מייצר תוכנית...' : 'צור תוכנית יומית'}
            </button>
          </div>
        ) : (
          <div className={styles.subjectGroups}>
            {Object.entries(groupedItems).map(([subject, items]) => (
              <div key={subject} className={styles.subjectGroup}>
                <div className={styles.subjectHeader}>
                  <div className={styles.subjectDot} style={{ background: subjectColors[subject] || '#64748B' }} />
                  <span className={styles.subjectName}>{subjectNamesHe[subject] || subject}</span>
                  <span className={styles.subjectCount}>{items.length} משימות</span>
                </div>
                <div className={styles.itemsList}>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`${styles.planItem} ${item.status === 'completed' ? styles.planItemDone : ''}`}
                      style={{ borderInlineStartColor: subjectColors[item.subject] || '#64748B' }}
                    >
                      <div className={styles.itemMain}>
                        <span className={styles.itemTopic}>{item.topic}</span>
                        <div className={styles.itemMeta}>
                          <span className={styles.itemMinutes}>
                            <Clock size={13} />
                            {item.target_minutes} דקות
                          </span>
                          <span className={`${styles.itemDifficulty} ${styles[`diff_${item.difficulty}`]}`}>
                            {difficultyLabels[item.difficulty] || item.difficulty}
                          </span>
                        </div>
                        <span className={styles.itemReason}>{item.reason}</span>
                      </div>
                      <div className={styles.itemAction}>
                        {item.status === 'completed' ? (
                          <span className={styles.doneCheck}>
                            <CheckCircle2 size={22} />
                          </span>
                        ) : (
                          <button
                            className={styles.startBtn}
                            onClick={() => completeItem(item.id, item.target_minutes)}
                            disabled={completingId === item.id}
                          >
                            {completingId === item.id ? <Loader2 size={16} className={styles.spinner} /> : <Play size={16} />}
                            התחל
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
