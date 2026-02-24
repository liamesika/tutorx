// ============================================
// Type Definitions - AI Learning Platform
// ============================================

export type UserRole = 'student' | 'parent' | 'tutor' | 'admin';

export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

export type Subject = 'math' | 'hebrew' | 'english' | 'science' | 'history' | 'geography';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Student extends User {
  role: 'student';
  grade: Grade;
  xp: number;
  level: number;
  streak: number;
  subjects: Subject[];
  parentId: string;
}

export interface Parent extends User {
  role: 'parent';
  children: string[];
  plan: 'free' | 'premium';
}

export interface Tutor extends User {
  role: 'tutor';
  bio: string;
  subjects: Subject[];
  grades: Grade[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  experience: number;
  isApproved: boolean;
  isAvailable: boolean;
  videoIntro?: string;
}

export interface Admin extends User {
  role: 'admin';
}

// Learning
export interface Exercise {
  id: string;
  subject: Subject;
  grade: Grade;
  question: string;
  options?: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
}

export interface SessionResult {
  id: string;
  studentId: string;
  subject: Subject;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  duration: number; // minutes
  weakTopics: string[];
  date: string;
}

// Tutoring
export interface TimeSlot {
  id: string;
  tutorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  parentId: string;
  studentId: string;
  tutorId: string;
  slot: TimeSlot;
  subject: Subject;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
}

export interface Lesson {
  id: string;
  booking: Booking;
  tutor: Tutor;
  student: Student;
  date: string;
  startTime: string;
  endTime: string;
  subject: Subject;
  status: 'upcoming' | 'in_progress' | 'completed';
}

// Analytics
export interface ProgressData {
  date: string;
  score: number;
  xp: number;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalExercises: number;
  averageScore: number;
  xpEarned: number;
  timeSpent: number;
  strongSubjects: Subject[];
  weakSubjects: Subject[];
  recommendations: string[];
}

// Pricing
export interface PricingPlan {
  id: string;
  name: string;
  nameHe: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
}

// Earnings
export interface EarningsData {
  month: string;
  gross: number;
  commission: number;
  net: number;
  lessonsCount: number;
}

// Testimonial
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

// FAQ
export interface FAQItem {
  question: string;
  answer: string;
}

// Subject metadata
export interface SubjectInfo {
  id: Subject;
  nameHe: string;
  icon: string;
  color: string;
  description: string;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  lucide?: string;
}

// Daily Plan
export type PlanItemStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface DailyGoal {
  id: string;
  studentId: string;
  minutesPerDay: number;
  autoPlanEnabled: boolean;
}

export interface DailyPlan {
  id: string;
  studentId: string;
  date: string;
  generatedAt: string;
  totalMinutes: number;
  completedMinutes: number;
  items: DailyPlanItem[];
}

export interface DailyPlanItem {
  id: string;
  planId: string;
  subject: Subject;
  topic: string;
  targetMinutes: number;
  completedMinutes: number;
  priorityScore: number;
  status: PlanItemStatus;
  difficulty: 'easy' | 'medium' | 'hard';
  reason: string;
  reasonType: 'weakness' | 'review' | 'maintenance';
}

export interface StudentStreak {
  studentId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
}

// Student Profile
export interface StudentProfileData {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  grade: Grade;
  city?: string;
  xp: number;
  level: number;
  streak: number;
  subjects: Subject[];
  learningStyle?: 'visual' | 'practice' | 'step_by_step' | 'fast_paced';
  struggleTopics: Record<string, string[]>;
  subjectLevels: Record<string, number>;
  goals?: string;
  interests: string[];
  dailyGoalMinutes: number;
  autoPlanEnabled: boolean;
}
