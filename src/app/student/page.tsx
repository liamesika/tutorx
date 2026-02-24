'use client';

import { useState } from 'react';
import Link from 'next/link';
import { subjects, gradeNames, mockStudents } from '@/data/mock';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import {
  Zap, Flame, Calculator, BookOpen,
  Globe, Microscope, Landmark, Map, ArrowLeft, Clock
} from 'lucide-react';
import styles from './page.module.scss';

const subjectIcons: Record<string, React.ReactNode> = {
  math: <Calculator size={24} />,
  hebrew: <BookOpen size={24} />,
  english: <Globe size={24} />,
  science: <Microscope size={24} />,
  history: <Landmark size={24} />,
  geography: <Map size={24} />,
};

const activityIcons: Record<string, React.ReactNode> = {
  math: <Calculator size={18} />,
  hebrew: <BookOpen size={18} />,
};

export default function StudentPage() {
  const student = mockStudents[0];
  const [selectedGrade] = useState(student.grade);

  return (
    <div className={styles.page}>
      {/* Student header */}
      <div className={styles.header}>
        <div className={styles.greeting}>
          <h1>שלום, {student.name}!</h1>
          <p>{gradeNames[selectedGrade]} · Level {student.level}</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statIconWrap} data-color="primary">
              <Zap size={18} />
            </div>
            <div>
              <span className={styles.statValue}>{student.xp.toLocaleString()}</span>
              <span className={styles.statLabel}>XP</span>
            </div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statIconWrap} data-color="warning">
              <Flame size={18} />
            </div>
            <div>
              <span className={styles.statValue}>{student.streak}</span>
              <span className={styles.statLabel}>רצף ימים</span>
            </div>
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <div className={styles.xpSection}>
        <ProgressBar
          value={student.xp % 500}
          max={500}
          label={`Level ${student.level} → Level ${student.level + 1}`}
          showValue
          variant="accent"
        />
      </div>

      {/* Subject selection */}
      <div className={styles.section}>
        <h2>בחרו מקצוע לתרגול</h2>
        <div className={styles.subjectsGrid}>
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/student/exercise?subject=${subject.id}`}
              className={styles.subjectCard}
            >
              <div className={styles.subjectIcon} style={{ backgroundColor: subject.color + '12', color: subject.color }}>
                {subjectIcons[subject.id] || <BookOpen size={24} />}
              </div>
              <h3>{subject.nameHe}</h3>
              <p>{subject.description}</p>
              <span className={styles.subjectCta}>
                התחל תרגול
                <ArrowLeft size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className={styles.section}>
        <h2>פעילות אחרונה</h2>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon} data-color="primary">
              {activityIcons.math}
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityTitle}>מתמטיקה — 8/10 תשובות נכונות</p>
              <p className={styles.activityTime}>
                <Clock size={12} />
                היום, 14:30
              </p>
            </div>
            <Badge variant="success" size="sm">+150 XP</Badge>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon} data-color="accent">
              {activityIcons.hebrew}
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityTitle}>עברית — 6/8 תשובות נכונות</p>
              <p className={styles.activityTime}>
                <Clock size={12} />
                אתמול, 16:00
              </p>
            </div>
            <Badge variant="success" size="sm">+100 XP</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
