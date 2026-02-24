'use client';

import { useState, useEffect } from 'react';
import {
  UserCircle, Edit3, Save, X, MapPin, GraduationCap,
  Flame, Zap, Star, BookOpen, Brain, Target,
  CheckCircle, Eye, Pencil, Footprints, Rocket, Loader2
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

const gradeNames: Record<number, string> = {
  1: 'כיתה א׳', 2: 'כיתה ב׳', 3: 'כיתה ג׳',
  4: 'כיתה ד׳', 5: 'כיתה ה׳', 6: 'כיתה ו׳',
};

const learningStyleLabels: Record<string, { label: string; icon: string }> = {
  visual: { label: 'למידה ויזואלית', icon: 'Eye' },
  practice: { label: 'תרגול מעשי', icon: 'Pencil' },
  step_by_step: { label: 'שלב אחר שלב', icon: 'Footprints' },
  fast_paced: { label: 'קצב מהיר', icon: 'Rocket' },
};

const allSubjects = ['math', 'hebrew', 'english', 'science', 'history', 'geography'];

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  city: string | null;
  grade: number;
  xp: number;
  level: number;
  streak: number;
  subjects: string[];
  learning_style: string | null;
  struggle_topics: Record<string, string[]>;
  subject_levels: Record<string, number>;
  goals: string | null;
  interests: Array<{ name_he: string; category: string }>;
  dailyGoal: { minutes_per_day: number; auto_plan_enabled: boolean };
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = ['#2563EB', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#EC4899'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    city: '',
    grade: 4,
    subjects: [] as string[],
    learningStyle: '',
    goals: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/student/profile');
      const data = await res.json();
      setProfile(data.profile);
      if (data.profile) {
        setEditForm({
          fullName: data.profile.full_name || '',
          city: data.profile.city || '',
          grade: data.profile.grade || 4,
          subjects: data.profile.subjects || [],
          learningStyle: data.profile.learning_style || '',
          goals: data.profile.goals || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editForm.fullName,
          city: editForm.city,
          grade: editForm.grade,
          subjects: editForm.subjects,
          learningStyle: editForm.learningStyle,
          goals: editForm.goals,
        }),
      });
      await fetchProfile();
      setEditing(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setEditForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>
          <Loader2 size={32} className={styles.spinner} />
          <p>טוען פרופיל...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <UserCircle size={48} />
          <p>לא נמצא פרופיל</p>
        </div>
      </div>
    );
  }

  const xpForNextLevel = 500;
  const xpProgress = profile.xp % xpForNextLevel;

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <UserCircle size={28} />
          הפרופיל שלי
        </h1>
      </div>

      {/* Profile Hero Card */}
      <div className={styles.heroCard}>
        <div className={styles.heroTop}>
          <div className={styles.avatarLarge} style={{ background: getAvatarColor(profile.full_name) }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} />
            ) : (
              <span>{getInitials(profile.full_name)}</span>
            )}
          </div>
          <div className={styles.heroInfo}>
            <h2 className={styles.heroName}>{profile.full_name}</h2>
            <div className={styles.heroMeta}>
              <span className={styles.metaItem}>
                <GraduationCap size={15} />
                {gradeNames[profile.grade] || `כיתה ${profile.grade}`}
              </span>
              {profile.city && (
                <span className={styles.metaItem}>
                  <MapPin size={15} />
                  {profile.city}
                </span>
              )}
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <Zap size={16} className={styles.xpIcon} />
                <span>{profile.xp.toLocaleString()} XP</span>
              </div>
              <div className={styles.heroStat}>
                <Star size={16} className={styles.levelIcon} />
                <span>Level {profile.level}</span>
              </div>
              <div className={styles.heroStat}>
                <Flame size={16} className={styles.streakIcon} />
                <span>{profile.streak} ימים</span>
              </div>
            </div>
          </div>
          <button className={styles.editBtn} onClick={() => setEditing(!editing)}>
            {editing ? <X size={18} /> : <Edit3 size={18} />}
            {editing ? 'ביטול' : 'עריכה'}
          </button>
        </div>
        {/* XP Progress */}
        <div className={styles.xpBar}>
          <div className={styles.xpBarHeader}>
            <span>Level {profile.level}</span>
            <span>{xpProgress}/{xpForNextLevel} XP</span>
          </div>
          <div className={styles.xpTrack}>
            <div className={styles.xpFill} style={{ width: `${(xpProgress / xpForNextLevel) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Edit Form (conditional) */}
      {editing && (
        <div className={styles.editSection}>
          <h3 className={styles.sectionTitle}><Edit3 size={18} /> עריכת פרופיל</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>שם מלא</label>
              <input
                type="text"
                value={editForm.fullName}
                onChange={e => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>עיר</label>
              <input
                type="text"
                value={editForm.city}
                onChange={e => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>כיתה</label>
              <select
                value={editForm.grade}
                onChange={e => setEditForm(prev => ({ ...prev, grade: Number(e.target.value) }))}
                className={styles.formInput}
              >
                {[1, 2, 3, 4, 5, 6].map(g => (
                  <option key={g} value={g}>{gradeNames[g]}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>יעדים</label>
              <textarea
                value={editForm.goals}
                onChange={e => setEditForm(prev => ({ ...prev, goals: e.target.value }))}
                className={styles.formTextarea}
                placeholder="מה היעדים שלי..."
                rows={2}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <label className={styles.formSectionLabel}>מקצועות</label>
            <div className={styles.subjectCheckboxes}>
              {allSubjects.map(subject => (
                <button
                  key={subject}
                  className={`${styles.subjectChip} ${editForm.subjects.includes(subject) ? styles.chipActive : ''}`}
                  onClick={() => toggleSubject(subject)}
                  style={editForm.subjects.includes(subject) ? { borderColor: subjectColors[subject], background: subjectColors[subject] + '10' } : {}}
                >
                  <CheckCircle size={14} />
                  {subjectNamesHe[subject]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formSection}>
            <label className={styles.formSectionLabel}>סגנון למידה</label>
            <div className={styles.styleOptions}>
              {Object.entries(learningStyleLabels).map(([key, { label }]) => (
                <button
                  key={key}
                  className={`${styles.styleOption} ${editForm.learningStyle === key ? styles.styleActive : ''}`}
                  onClick={() => setEditForm(prev => ({ ...prev, learningStyle: key }))}
                >
                  {key === 'visual' && <Eye size={18} />}
                  {key === 'practice' && <Pencil size={18} />}
                  {key === 'step_by_step' && <Footprints size={18} />}
                  {key === 'fast_paced' && <Rocket size={18} />}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => setEditing(false)}>ביטול</button>
            <button className={styles.saveBtn} onClick={saveProfile} disabled={saving}>
              {saving ? <Loader2 size={16} className={styles.spinner} /> : <Save size={16} />}
              שמירה
            </button>
          </div>
        </div>
      )}

      {/* Identity Summary */}
      <div className={styles.summarySection}>
        <h3 className={styles.sectionTitle}><Brain size={18} /> פרופיל למידה</h3>

        {/* Subject Levels */}
        <div className={styles.subjectLevels}>
          {(profile.subjects || []).map(subject => {
            const level = profile.subject_levels?.[subject] || 1;
            return (
              <div key={subject} className={styles.subjectLevel}>
                <div className={styles.subjectLevelHeader}>
                  <div className={styles.subjectLevelDot} style={{ background: subjectColors[subject] || '#64748B' }} />
                  <span className={styles.subjectLevelName}>{subjectNamesHe[subject]}</span>
                  <span className={styles.subjectLevelValue}>רמה {level}/5</span>
                </div>
                <div className={styles.levelTrack}>
                  <div className={styles.levelFill} style={{ width: `${(level / 5) * 100}%`, background: subjectColors[subject] || '#64748B' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Struggle Topics */}
        {Object.keys(profile.struggle_topics || {}).length > 0 && (
          <div className={styles.struggleSection}>
            <h4 className={styles.subSectionTitle}>נושאים לשיפור</h4>
            <div className={styles.struggleList}>
              {Object.entries(profile.struggle_topics).map(([subject, topics]) => (
                <div key={subject} className={styles.struggleSubject}>
                  <span className={styles.struggleSubjectName}>{subjectNamesHe[subject]}</span>
                  <div className={styles.struggleTags}>
                    {(topics as string[]).map(topic => (
                      <span key={topic} className={styles.struggleTag}>{topic}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Style */}
        {profile.learning_style && (
          <div className={styles.styleDisplay}>
            <h4 className={styles.subSectionTitle}>סגנון למידה</h4>
            <div className={styles.styleCard}>
              {profile.learning_style === 'visual' && <Eye size={24} />}
              {profile.learning_style === 'practice' && <Pencil size={24} />}
              {profile.learning_style === 'step_by_step' && <Footprints size={24} />}
              {profile.learning_style === 'fast_paced' && <Rocket size={24} />}
              <span>{learningStyleLabels[profile.learning_style]?.label || profile.learning_style}</span>
            </div>
          </div>
        )}

        {/* Interests */}
        {profile.interests?.length > 0 && (
          <div className={styles.interestsSection}>
            <h4 className={styles.subSectionTitle}>תחומי עניין</h4>
            <div className={styles.interestTags}>
              {profile.interests.map((interest, i) => (
                <span key={i} className={styles.interestTag}>{interest.name_he}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} data-color="primary"><Zap size={20} /></div>
          <div>
            <span className={styles.statValue}>{profile.xp.toLocaleString()}</span>
            <span className={styles.statLabel}>נקודות XP</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} data-color="accent"><Star size={20} /></div>
          <div>
            <span className={styles.statValue}>{profile.level}</span>
            <span className={styles.statLabel}>רמה</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} data-color="warning"><Flame size={20} /></div>
          <div>
            <span className={styles.statValue}>{profile.streak}</span>
            <span className={styles.statLabel}>רצף ימים</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} data-color="success"><BookOpen size={20} /></div>
          <div>
            <span className={styles.statValue}>{profile.subjects?.length || 0}</span>
            <span className={styles.statLabel}>מקצועות</span>
          </div>
        </div>
      </div>
    </div>
  );
}
