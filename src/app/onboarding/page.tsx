'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Backpack, BookOpen, BarChart3, Target, Brain, Palette, Calculator, Globe, FlaskConical, Landmark, Map, Eye, Ear, Activity, Pencil } from 'lucide-react';
import styles from './page.module.scss';

interface InterestTag {
  id: string;
  name_he: string;
  name_en: string;
  category: string;
  icon: string | null;
}

const TOTAL_STEPS = 6;

const gradeOptions = [
  { value: 1, label: 'כיתה א׳', icon: 'א' },
  { value: 2, label: 'כיתה ב׳', icon: 'ב' },
  { value: 3, label: 'כיתה ג׳', icon: 'ג' },
  { value: 4, label: 'כיתה ד׳', icon: 'ד' },
  { value: 5, label: 'כיתה ה׳', icon: 'ה' },
  { value: 6, label: 'כיתה ו׳', icon: 'ו' },
];

const subjectOptions: { id: string; label: string; icon: ReactNode }[] = [
  { id: 'math', label: 'מתמטיקה', icon: <Calculator size={20} strokeWidth={1.75} /> },
  { id: 'hebrew', label: 'עברית', icon: <BookOpen size={20} strokeWidth={1.75} /> },
  { id: 'english', label: 'אנגלית', icon: <Globe size={20} strokeWidth={1.75} /> },
  { id: 'science', label: 'מדעים', icon: <FlaskConical size={20} strokeWidth={1.75} /> },
  { id: 'history', label: 'היסטוריה', icon: <Landmark size={20} strokeWidth={1.75} /> },
  { id: 'geography', label: 'גיאוגרפיה', icon: <Map size={20} strokeWidth={1.75} /> },
];

const topicsBySubject: Record<string, string[]> = {
  math: ['שברים', 'חשבון', 'גיאומטריה', 'בעיות מילוליות', 'אחוזים', 'מספרים שליליים'],
  hebrew: ['הבנת הנקרא', 'כתיבה', 'דקדוק', 'אוצר מילים', 'חיבור'],
  english: ['קריאה', 'כתיבה', 'דקדוק', 'אוצר מילים', 'הבנת נשמע'],
  science: ['חשמל', 'כוחות', 'מערכות גוף', 'חומרים', 'אנרגיה'],
  history: ['תקופות', 'מלחמות', 'ציוויליזציות', 'מנהיגים', 'תרבויות'],
  geography: ['מפות', 'אקלים', 'מדינות', 'נהרות', 'הרים'],
};

const learningStyles: { id: string; icon: ReactNode; label: string; desc: string }[] = [
  { id: 'visual', icon: <Eye size={22} strokeWidth={1.75} />, label: 'חזותי', desc: 'אני לומד עם תמונות וסרטונים' },
  { id: 'auditory', icon: <Ear size={22} strokeWidth={1.75} />, label: 'שמיעתי', desc: 'אני לומד מהקשבה והסברים' },
  { id: 'kinesthetic', icon: <Activity size={22} strokeWidth={1.75} />, label: 'תנועתי', desc: 'אני לומד בפעילות מעשית' },
  { id: 'reading', icon: <Pencil size={22} strokeWidth={1.75} />, label: 'קריאה/כתיבה', desc: 'אני לומד מקריאה ורישום' },
];

const levelLabels: Record<number, string> = {
  1: 'מתחיל',
  2: 'בסיסי',
  3: 'ממוצע',
  4: 'טוב',
  5: 'מצוין',
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Form state
  const [grade, setGrade] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectLevels, setSubjectLevels] = useState<Record<string, number>>({});
  const [struggleTopics, setStruggleTopics] = useState<Record<string, string[]>>({});
  const [learningStyle, setLearningStyle] = useState<string | null>(null);
  const [interestTagIds, setInterestTagIds] = useState<string[]>([]);
  const [goals, setGoals] = useState('');
  const [allTags, setAllTags] = useState<InterestTag[]>([]);

  useEffect(() => {
    fetch('/api/onboarding')
      .then((r) => r.json())
      .then((data) => {
        if (data.all_tags) setAllTags(data.all_tags);
        if (data.student?.onboarding_completed) {
          // Pre-fill if already completed
          const s = data.student;
          if (s.grade) setGrade(s.grade);
          if (s.subjects) setSubjects(s.subjects);
          if (s.subject_levels) setSubjectLevels(s.subject_levels);
          if (s.struggle_topics) setStruggleTopics(s.struggle_topics);
          if (s.learning_style) setLearningStyle(s.learning_style);
          if (s.goals) setGoals(s.goals);
        }
        if (data.interest_tag_ids) setInterestTagIds(data.interest_tag_ids);
      })
      .catch(() => {});
  }, []);

  const toggleSubject = (id: string) => {
    setSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleStruggleTopic = (subject: string, topic: string) => {
    setStruggleTopics((prev) => {
      const current = prev[subject] ?? [];
      return {
        ...prev,
        [subject]: current.includes(topic)
          ? current.filter((t) => t !== topic)
          : [...current, topic],
      };
    });
  };

  const toggleInterest = (id: string) => {
    setInterestTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const canProceed = useCallback(() => {
    switch (step) {
      case 0:
        return grade !== null;
      case 1:
        return subjects.length > 0;
      case 2:
        return true; // levels optional
      case 3:
        return true; // struggles optional
      case 4:
        return true; // style optional
      case 5:
        return true; // interests optional
      default:
        return true;
    }
  }, [step, grade, subjects]);

  const handleNext = async () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      return;
    }

    // Final step → save
    setSaving(true);
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          subjects,
          subject_levels: subjectLevels,
          struggle_topics: struggleTopics,
          learning_style: learningStyle,
          goals: goals || null,
          interest_tag_ids: interestTagIds,
        }),
      });
      router.push('/student/feed');
    } catch {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className={styles.stepHeader}>
              <span className={styles.stepIcon}><Backpack size={28} strokeWidth={1.75} /></span>
              <h2>באיזו כיתה את/ה?</h2>
              <p>נתאים את התכנים בדיוק לרמה שלך</p>
            </div>
            <div className={styles.gradeGrid}>
              {gradeOptions.map((g) => (
                <button
                  key={g.value}
                  className={`${styles.gradeOption} ${grade === g.value ? styles.selected : ''}`}
                  onClick={() => setGrade(g.value)}
                >
                  <span className={styles.gradeIcon}>{g.icon}</span>
                  <span className={styles.gradeLabel}>{g.label}</span>
                </button>
              ))}
            </div>
          </>
        );

      case 1:
        return (
          <>
            <div className={styles.stepHeader}>
              <span className={styles.stepIcon}><BookOpen size={28} strokeWidth={1.75} /></span>
              <h2>באילו מקצועות צריך עזרה?</h2>
              <p>בחרו מקצוע אחד או יותר</p>
            </div>
            <div className={styles.subjectList}>
              {subjectOptions.map((s) => (
                <button
                  key={s.id}
                  className={`${styles.subjectChip} ${subjects.includes(s.id) ? styles.selected : ''}`}
                  onClick={() => toggleSubject(s.id)}
                >
                  <span className={styles.chipIcon}>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className={styles.stepHeader}>
              <span className={styles.stepIcon}><BarChart3 size={28} strokeWidth={1.75} /></span>
              <h2>מה הרמה שלך בכל מקצוע?</h2>
              <p>זה עוזר לנו למצוא את המורה הנכון</p>
            </div>
            {subjects.map((subId) => {
              const sub = subjectOptions.find((s) => s.id === subId);
              const level = subjectLevels[subId] ?? 3;
              return (
                <div key={subId} className={styles.levelSection}>
                  <div className={styles.levelHeader}>
                    <span className={styles.levelSubject}>
                      {sub?.icon} {sub?.label}
                    </span>
                    <span className={styles.levelValue}>{levelLabels[level]}</span>
                  </div>
                  <div className={styles.levelTrack}>
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        className={`${styles.levelDot} ${v <= level ? styles.filled : ''}`}
                        onClick={() =>
                          setSubjectLevels((prev) => ({ ...prev, [subId]: v }))
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        );

      case 3:
        return (
          <>
            <div className={styles.stepHeader}>
              <span className={styles.stepIcon}><Target size={28} strokeWidth={1.75} /></span>
              <h2>מה הכי קשה לך?</h2>
              <p>נמצא מורים שחזקים בדיוק בנושאים האלה</p>
            </div>
            {subjects.map((subId) => {
              const sub = subjectOptions.find((s) => s.id === subId);
              const topics = topicsBySubject[subId] ?? [];
              return (
                <div key={subId} className={styles.topicSection}>
                  <h3>
                    {sub?.icon} {sub?.label}
                  </h3>
                  <div className={styles.topicChips}>
                    {topics.map((topic) => (
                      <button
                        key={topic}
                        className={`${styles.topicChip} ${
                          struggleTopics[subId]?.includes(topic) ? styles.selected : ''
                        }`}
                        onClick={() => toggleStruggleTopic(subId, topic)}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        );

      case 4:
        return (
          <>
            <div className={styles.stepHeader}>
              <span className={styles.stepIcon}><Brain size={28} strokeWidth={1.75} /></span>
              <h2>איך את/ה הכי אוהב/ת ללמוד?</h2>
              <p>כל אחד לומד אחרת — וזה בסדר!</p>
            </div>
            <div className={styles.styleGrid}>
              {learningStyles.map((ls) => (
                <button
                  key={ls.id}
                  className={`${styles.styleOption} ${
                    learningStyle === ls.id ? styles.selected : ''
                  }`}
                  onClick={() => setLearningStyle(ls.id)}
                >
                  <span className={styles.styleIcon}>{ls.icon}</span>
                  <span className={styles.styleLabel}>{ls.label}</span>
                  <span className={styles.styleDesc}>{ls.desc}</span>
                </button>
              ))}
            </div>
          </>
        );

      case 5:
        return (
          <>
            <div className={styles.stepHeader}>
              <span className={styles.stepIcon}><Palette size={28} strokeWidth={1.75} /></span>
              <h2>מה מעניין אותך?</h2>
              <p>נמצא מורים עם תחביבים דומים לשלך</p>
            </div>
            <div className={styles.interestGrid}>
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  className={`${styles.interestTag} ${
                    interestTagIds.includes(tag.id) ? styles.selected : ''
                  }`}
                  onClick={() => toggleInterest(tag.id)}
                >
                  <span className={styles.tagIcon}>{tag.icon}</span>
                  {tag.name_he}
                </button>
              ))}
            </div>
            <textarea
              className={styles.goalsArea}
              placeholder="ספרו לנו על המטרות שלכם (אופציונלי)..."
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              style={{ marginTop: '1.5rem' }}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.progressBar}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`${styles.step} ${i === step ? styles.active : ''} ${
                i < step ? styles.done : ''
              }`}
            />
          ))}
        </div>

        <div className={styles.card}>{renderStep()}</div>

        <div className={styles.nav}>
          {step > 0 ? (
            <button className={styles.backBtn} onClick={() => setStep(step - 1)}>
              חזרה
            </button>
          ) : (
            <div />
          )}
          <button
            className={styles.nextBtn}
            onClick={handleNext}
            disabled={!canProceed() || saving}
          >
            {saving
              ? 'שומר...'
              : step === TOTAL_STEPS - 1
                ? 'סיום!'
                : 'הבא'}
          </button>
        </div>

        {step >= 2 && step < TOTAL_STEPS - 1 && (
          <span className={styles.skipLink} onClick={() => setStep(step + 1)}>
            דלג על שלב זה
          </span>
        )}
      </div>
    </div>
  );
}
