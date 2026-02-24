import type { Subject } from '@/types';

interface ExerciseAttempt {
  subject: string;
  total_questions: number;
  correct_answers: number;
  weak_topics: string[];
  duration_minutes: number;
  created_at: string;
}

interface TopicWeight {
  subject: Subject;
  topic: string;
  weight: number;
  difficulty: 'easy' | 'medium' | 'hard';
  reason: string;
  reasonType: 'weakness' | 'review' | 'maintenance';
  lastSeen: number; // days ago
  incorrectRate: number;
}

// Hebrew subject names
const subjectNamesHe: Record<string, string> = {
  math: 'מתמטיקה',
  hebrew: 'עברית',
  english: 'אנגלית',
  science: 'מדעים',
  history: 'היסטוריה',
  geography: 'גיאוגרפיה',
};

// Default topics per subject for when student has no history
const defaultTopics: Record<string, string[]> = {
  math: ['חיבור וחיסור', 'כפל', 'חילוק', 'שברים', 'גיאומטריה', 'בעיות מילוליות'],
  hebrew: ['שורשים', 'משפטים', 'הבנת הנקרא', 'כתיבה', 'לשון', 'פועל בבניינים'],
  english: ['Reading', 'Vocabulary', 'Grammar', 'Writing', 'Listening'],
  science: ['חומרים', 'אנרגיה', 'גוף האדם', 'צמחים', 'חיות', 'כדור הארץ'],
  history: ['ישראל הקדומה', 'תקופת המקרא', 'היסטוריה מודרנית'],
  geography: ['מפות', 'אקלים', 'ישראל', 'עולם'],
};

function daysBetween(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function generateDailyPlan(
  targetMinutes: number,
  attempts: ExerciseAttempt[],
  studentSubjects: string[],
  struggleTopics: Record<string, string[]>,
  subjectLevels: Record<string, number>
): {
  items: Array<{
    subject: Subject;
    topic: string;
    targetMinutes: number;
    priorityScore: number;
    difficulty: 'easy' | 'medium' | 'hard';
    reason: string;
    reasonType: 'weakness' | 'review' | 'maintenance';
    sortOrder: number;
  }>;
  totalMinutes: number;
} {
  const topics: TopicWeight[] = [];
  const subjects = studentSubjects.length > 0 ? studentSubjects : ['math', 'hebrew', 'english'];

  // Analyze attempts to build topic weights
  const topicMap = new Map<string, { attempts: number; correct: number; total: number; lastSeen: string }>();

  for (const attempt of attempts) {
    for (const topic of attempt.weak_topics) {
      const key = `${attempt.subject}::${topic}`;
      const existing = topicMap.get(key) || { attempts: 0, correct: 0, total: 0, lastSeen: attempt.created_at };
      existing.attempts++;
      existing.correct += attempt.correct_answers;
      existing.total += attempt.total_questions;
      if (new Date(attempt.created_at) > new Date(existing.lastSeen)) {
        existing.lastSeen = attempt.created_at;
      }
      topicMap.set(key, existing);
    }
  }

  // Build weakness topics from attempts
  for (const [key, data] of topicMap.entries()) {
    const [subject, topic] = key.split('::');
    if (!subjects.includes(subject)) continue;

    const incorrectRate = 1 - (data.correct / Math.max(data.total, 1));
    const daysAgo = daysBetween(data.lastSeen);
    const spacedRepetitionScore = Math.min(daysAgo / 3, 5); // grows as time passes

    const weight = (incorrectRate * 6) + (spacedRepetitionScore * 3);

    topics.push({
      subject: subject as Subject,
      topic,
      weight,
      difficulty: incorrectRate > 0.5 ? 'easy' : incorrectRate > 0.3 ? 'medium' : 'hard',
      reason: incorrectRate > 0.4
        ? `חיזוק נקודה חלשה ב${subjectNamesHe[subject] || subject}`
        : daysAgo > 3
          ? `חזרה אחרי ${daysAgo} ימים`
          : `תרגול ב${subjectNamesHe[subject] || subject}`,
      reasonType: incorrectRate > 0.4 ? 'weakness' : daysAgo > 3 ? 'review' : 'maintenance',
      lastSeen: daysAgo,
      incorrectRate,
    });
  }

  // Add struggle topics from student profile
  for (const subject of subjects) {
    const struggles = struggleTopics[subject] || [];
    for (const topic of struggles) {
      const key = `${subject}::${topic}`;
      if (!topicMap.has(key)) {
        topics.push({
          subject: subject as Subject,
          topic,
          weight: 8, // High priority for known struggles
          difficulty: 'easy',
          reason: `חיזוק נקודה חלשה ב${subjectNamesHe[subject] || subject}`,
          reasonType: 'weakness',
          lastSeen: 999,
          incorrectRate: 0.7,
        });
      }
    }
  }

  // Add default topics for subjects with no data (maintenance)
  for (const subject of subjects) {
    const hasTopics = topics.some(t => t.subject === subject);
    if (!hasTopics) {
      const subjectTopics = defaultTopics[subject] || ['תרגול כללי'];
      // Pick 2 random topics for maintenance
      const shuffled = [...subjectTopics].sort(() => Math.random() - 0.5);
      for (const topic of shuffled.slice(0, 2)) {
        topics.push({
          subject: subject as Subject,
          topic,
          weight: 2,
          difficulty: 'medium',
          reason: `שמירה על רמה ב${subjectNamesHe[subject] || subject}`,
          reasonType: 'maintenance',
          lastSeen: 0,
          incorrectRate: 0,
        });
      }
    }
  }

  // Sort by weight (highest priority first)
  topics.sort((a, b) => b.weight - a.weight);

  // Allocate minutes: 60% weakness, 30% review, 10% maintenance
  const weaknessMinutes = Math.round(targetMinutes * 0.6);
  const reviewMinutes = Math.round(targetMinutes * 0.3);
  const maintenanceMinutes = targetMinutes - weaknessMinutes - reviewMinutes;

  const weaknessTopics = topics.filter(t => t.reasonType === 'weakness');
  const reviewTopics = topics.filter(t => t.reasonType === 'review');
  const maintenanceTopics = topics.filter(t => t.reasonType === 'maintenance');

  type PlanItem = {
    subject: Subject;
    topic: string;
    targetMinutes: number;
    priorityScore: number;
    difficulty: 'easy' | 'medium' | 'hard';
    reason: string;
    reasonType: 'weakness' | 'review' | 'maintenance';
    sortOrder: number;
  };

  function allocate(pool: TopicWeight[], budget: number, minPerItem: number = 5): PlanItem[] {
    const result: PlanItem[] = [];
    let remaining = budget;

    for (const topic of pool) {
      if (remaining < minPerItem) break;
      const minutes = Math.min(Math.max(minPerItem, Math.round(remaining * 0.4)), remaining);
      result.push({
        subject: topic.subject,
        topic: topic.topic,
        targetMinutes: minutes,
        priorityScore: Math.round(topic.weight * 100) / 100,
        difficulty: topic.difficulty,
        reason: topic.reason,
        reasonType: topic.reasonType,
        sortOrder: 0,
      });
      remaining -= minutes;
    }

    return result;
  }

  const items = [
    ...allocate(weaknessTopics, weaknessMinutes),
    ...allocate(reviewTopics, reviewMinutes),
    ...allocate(maintenanceTopics, maintenanceMinutes),
  ];

  // If no items generated, create at least one per subject
  if (items.length === 0) {
    const perSubject = Math.max(5, Math.floor(targetMinutes / subjects.length));
    for (const subject of subjects) {
      const topic = (defaultTopics[subject] || ['תרגול כללי'])[0];
      items.push({
        subject: subject as Subject,
        topic,
        targetMinutes: perSubject,
        priorityScore: 1,
        difficulty: 'medium',
        reason: `תרגול יומי ב${subjectNamesHe[subject] || subject}`,
        reasonType: 'maintenance',
        sortOrder: 0,
      });
    }
  }

  // Assign sort order
  items.forEach((item, i) => { item.sortOrder = i; });

  const totalMinutes = items.reduce((sum, item) => sum + item.targetMinutes, 0);

  return { items, totalMinutes };
}
