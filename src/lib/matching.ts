// ============================================================
// Matching Engine — Deterministic Scoring Algorithm
// ============================================================

export interface StudentMatchProfile {
  grade: number;
  subjects: string[];
  subject_levels: Record<string, number>;
  struggle_topics: Record<string, string[]>;
  learning_style: string | null;
  city: string | null;
  interest_tag_ids: string[];
}

export interface TutorMatchProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  hourly_rate: number;
  trial_rate: number | null;
  rating_avg: number;
  review_count: number;
  city: string | null;
  is_available: boolean;
  subjects: Array<{ subject: string; grades: number[] }>;
  strengths: Array<{ subject: string; topic_name: string; strength: number; is_weak: boolean }>;
  interest_tag_ids: string[];
  slot_count: number;
}

export interface MatchResult {
  tutor: TutorMatchProfile;
  matchScore: number;
  compatibilityReasons: string[];
}

export function calculateMatchScore(
  student: StudentMatchProfile,
  tutor: TutorMatchProfile
): MatchResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Subject & grade alignment (max 30 pts)
  let subjectMatch = 0;
  for (const ts of tutor.subjects) {
    if (student.subjects.includes(ts.subject)) {
      subjectMatch += 10;
      if (ts.grades.includes(student.grade)) {
        subjectMatch += 5;
        reasons.push('מתאים לכיתה שלך');
      }
    }
  }
  score += Math.min(subjectMatch, 30);

  // 2. Struggle-strength overlap (max 25 pts)
  let struggleMatch = 0;
  for (const [subject, topics] of Object.entries(student.struggle_topics)) {
    for (const topic of topics) {
      const tutorStrength = tutor.strengths.find(
        (s) => s.subject === subject && s.topic_name === topic && !s.is_weak
      );
      if (tutorStrength) {
        struggleMatch += tutorStrength.strength * 2;
      }
    }
  }
  if (struggleMatch > 0) {
    reasons.push('חזק בדיוק בנושאים שקשים לך');
  }
  score += Math.min(struggleMatch, 25);

  // 3. Interest overlap (max 15 pts)
  const sharedInterests = tutor.interest_tag_ids.filter((t) =>
    student.interest_tag_ids.includes(t)
  );
  if (sharedInterests.length > 0) {
    score += Math.min(sharedInterests.length * 5, 15);
    reasons.push('יש לכם תחביבים משותפים');
  }

  // 4. City match (max 5 pts)
  if (student.city && tutor.city && student.city === tutor.city) {
    score += 5;
    reasons.push('באותו אזור מגורים');
  }

  // 5. Rating boost (max 15 pts)
  if (tutor.rating_avg >= 4.5) {
    score += 15;
    reasons.push('דירוג גבוה מאוד');
  } else if (tutor.rating_avg >= 4.0) {
    score += 10;
    reasons.push('דירוג גבוה');
  } else if (tutor.rating_avg >= 3.5) {
    score += 5;
  }

  // 6. Availability boost (max 10 pts)
  if (tutor.slot_count >= 10) {
    score += 10;
    reasons.push('זמינות גבוהה');
  } else if (tutor.slot_count >= 5) {
    score += 5;
  }

  // Ensure score is 0-100
  score = Math.min(Math.max(score, 0), 100);

  return {
    tutor,
    matchScore: score,
    compatibilityReasons: reasons,
  };
}
