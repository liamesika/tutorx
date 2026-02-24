import type {
  Student, Parent, Tutor, Exercise, SessionResult,
  TimeSlot, Lesson, ProgressData, WeeklyReport,
  PricingPlan, EarningsData, Testimonial, FAQItem,
  SubjectInfo, Booking
} from '@/types';

// ============================================
// Subject Metadata
// ============================================
export const subjects: SubjectInfo[] = [
  { id: 'math', nameHe: 'מתמטיקה', icon: '', color: '#2563EB', description: 'חשבון, גיאומטריה ואלגברה' },
  { id: 'hebrew', nameHe: 'עברית', icon: '', color: '#7C3AED', description: 'קריאה, כתיבה ולשון' },
  { id: 'english', nameHe: 'אנגלית', icon: '', color: '#0EA5E9', description: 'קריאה, דיבור וכתיבה' },
  { id: 'science', nameHe: 'מדעים', icon: '', color: '#10B981', description: 'פיזיקה, כימיה וביולוגיה' },
  { id: 'history', nameHe: 'היסטוריה', icon: '', color: '#F59E0B', description: 'היסטוריה של ישראל והעולם' },
  { id: 'geography', nameHe: 'גיאוגרפיה', icon: '', color: '#F43F5E', description: 'גיאוגרפיה של ישראל והעולם' },
];

export const gradeNames: Record<number, string> = {
  1: 'כיתה א׳',
  2: 'כיתה ב׳',
  3: 'כיתה ג׳',
  4: 'כיתה ד׳',
  5: 'כיתה ה׳',
  6: 'כיתה ו׳',
};

// ============================================
// Mock Students
// ============================================
export const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'יואב כהן',
    email: 'yoav@example.com',
    role: 'student',
    grade: 4,
    xp: 2450,
    level: 12,
    streak: 7,
    subjects: ['math', 'hebrew', 'english'],
    parentId: 'p1',
    createdAt: '2025-09-01',
  },
  {
    id: 's2',
    name: 'נועה לוי',
    email: 'noa@example.com',
    role: 'student',
    grade: 3,
    xp: 1800,
    level: 9,
    streak: 3,
    subjects: ['math', 'science'],
    parentId: 'p1',
    createdAt: '2025-10-15',
  },
];

// ============================================
// Mock Parents
// ============================================
export const mockParents: Parent[] = [
  {
    id: 'p1',
    name: 'רונית כהן',
    email: 'ronit@example.com',
    role: 'parent',
    children: ['s1', 's2'],
    plan: 'premium',
    createdAt: '2025-09-01',
  },
];

// ============================================
// Mock Tutors
// ============================================
export const mockTutors: Tutor[] = [
  {
    id: 't1',
    name: 'ד״ר מיכל אברהם',
    email: 'michal@example.com',
    role: 'tutor',
    bio: 'מורה למתמטיקה עם ניסיון של 15 שנה בהוראה פרטית. מתמחה בהכנה למבחנים ובבניית ביטחון עצמי אצל תלמידים.',
    subjects: ['math'],
    grades: [4, 5, 6],
    hourlyRate: 120,
    rating: 4.9,
    reviewCount: 127,
    experience: 15,
    isApproved: true,
    isAvailable: true,
    createdAt: '2024-01-15',
  },
  {
    id: 't2',
    name: 'דנה שרון',
    email: 'dana@example.com',
    role: 'tutor',
    bio: 'מורה לאנגלית ועברית. גישה יצירתית ומהנה ללמידה. מאמינה שכל ילד יכול להצליח עם הגישה הנכונה.',
    subjects: ['english', 'hebrew'],
    grades: [1, 2, 3, 4],
    hourlyRate: 100,
    rating: 4.8,
    reviewCount: 89,
    experience: 8,
    isApproved: true,
    isAvailable: true,
    createdAt: '2024-03-20',
  },
  {
    id: 't3',
    name: 'עמית גולן',
    email: 'amit@example.com',
    role: 'tutor',
    bio: 'סטודנט להוראת מדעים. שיעורים מעשיים וחווייתיים עם ניסויים וסרטונים. הופך את המדע לכיף!',
    subjects: ['science'],
    grades: [3, 4, 5, 6],
    hourlyRate: 90,
    rating: 4.7,
    reviewCount: 45,
    experience: 3,
    isApproved: true,
    isAvailable: true,
    createdAt: '2024-06-10',
  },
  {
    id: 't4',
    name: 'רחל מזרחי',
    email: 'rachel@example.com',
    role: 'tutor',
    bio: 'מורה ותיקה למתמטיקה ומדעים עם תואר שני בחינוך. מתמחה בילדים עם קשיי למידה.',
    subjects: ['math', 'science'],
    grades: [1, 2, 3, 4, 5, 6],
    hourlyRate: 140,
    rating: 5.0,
    reviewCount: 203,
    experience: 20,
    isApproved: true,
    isAvailable: false,
    createdAt: '2023-11-05',
  },
  {
    id: 't5',
    name: 'יוסי כרמל',
    email: 'yossi@example.com',
    role: 'tutor',
    bio: 'מורה לעברית והיסטוריה. אוהב לספר סיפורים ולהפוך את הלמידה להרפתקה. שיטות הוראה ייחודיות.',
    subjects: ['hebrew', 'history'],
    grades: [4, 5, 6],
    hourlyRate: 110,
    rating: 4.6,
    reviewCount: 67,
    experience: 10,
    isApproved: true,
    isAvailable: true,
    createdAt: '2024-02-28',
  },
  {
    id: 't6',
    name: 'ליאור ברק',
    email: 'lior@example.com',
    role: 'tutor',
    bio: 'בוגר הטכניון, מלמד מתמטיקה ומדעים ברמה גבוהה. מתמחה בפיתוח חשיבה מתמטית.',
    subjects: ['math', 'science'],
    grades: [5, 6],
    hourlyRate: 130,
    rating: 4.8,
    reviewCount: 92,
    experience: 6,
    isApproved: true,
    isAvailable: true,
    createdAt: '2024-04-15',
  },
];

// ============================================
// Mock Exercises
// ============================================
export const mockExercises: Exercise[] = [
  {
    id: 'e1',
    subject: 'math',
    grade: 4,
    question: 'כמה זה 247 + 358?',
    options: ['595', '605', '615', '585'],
    correctAnswer: '605',
    difficulty: 'easy',
    xpReward: 10,
  },
  {
    id: 'e2',
    subject: 'math',
    grade: 4,
    question: 'אם לדני יש 48 גולות והוא נותן שליש לחברו, כמה גולות נשארו לדני?',
    options: ['16', '32', '24', '36'],
    correctAnswer: '32',
    difficulty: 'medium',
    xpReward: 20,
  },
  {
    id: 'e3',
    subject: 'hebrew',
    grade: 4,
    question: 'מהו שורש המילה "הלכתי"?',
    options: ['ה.ל.כ', 'ל.כ.ת', 'כ.ת.י', 'ה.ל.ך'],
    correctAnswer: 'ה.ל.ך',
    difficulty: 'medium',
    xpReward: 15,
  },
  {
    id: 'e4',
    subject: 'english',
    grade: 4,
    question: 'Choose the correct word: "She ___ to school every day."',
    options: ['go', 'goes', 'going', 'went'],
    correctAnswer: 'goes',
    difficulty: 'easy',
    xpReward: 10,
  },
  {
    id: 'e5',
    subject: 'science',
    grade: 4,
    question: 'מהו מצב הצבירה של מים בטמפרטורה של 50 מעלות צלזיוס?',
    options: ['מוצק', 'נוזל', 'גז', 'פלזמה'],
    correctAnswer: 'נוזל',
    difficulty: 'easy',
    xpReward: 10,
  },
];

// ============================================
// Mock Session Results
// ============================================
export const mockSessionResults: SessionResult[] = [
  {
    id: 'sr1',
    studentId: 's1',
    subject: 'math',
    totalQuestions: 10,
    correctAnswers: 8,
    xpEarned: 150,
    duration: 15,
    weakTopics: ['חילוק', 'שברים'],
    date: '2026-02-19',
  },
  {
    id: 'sr2',
    studentId: 's1',
    subject: 'hebrew',
    totalQuestions: 8,
    correctAnswers: 6,
    xpEarned: 100,
    duration: 12,
    weakTopics: ['שורשים', 'פועל בבניין הפעיל'],
    date: '2026-02-18',
  },
];

// ============================================
// Mock Progress Data (for charts)
// ============================================
export const mockProgressData: ProgressData[] = [
  { date: '2026-02-13', score: 72, xp: 120 },
  { date: '2026-02-14', score: 78, xp: 150 },
  { date: '2026-02-15', score: 65, xp: 90 },
  { date: '2026-02-16', score: 82, xp: 180 },
  { date: '2026-02-17', score: 88, xp: 200 },
  { date: '2026-02-18', score: 75, xp: 100 },
  { date: '2026-02-19', score: 80, xp: 150 },
];

// ============================================
// Mock Weekly Report
// ============================================
export const mockWeeklyReport: WeeklyReport = {
  weekStart: '2026-02-13',
  weekEnd: '2026-02-19',
  totalExercises: 42,
  averageScore: 77,
  xpEarned: 990,
  timeSpent: 180,
  strongSubjects: ['math', 'english'],
  weakSubjects: ['hebrew'],
  recommendations: [
    'מומלץ לתרגל שורשים בעברית',
    'ביצועים מצוינים במתמטיקה - אפשר להתקדם לנושאים מתקדמים',
    'כדאי לתרגל 15 דקות כל יום לשמירה על הרצף',
  ],
};

// ============================================
// Mock Time Slots
// ============================================
export const mockTimeSlots: TimeSlot[] = [
  { id: 'ts1', tutorId: 't1', date: '2026-02-20', startTime: '16:00', endTime: '17:00', isBooked: false },
  { id: 'ts2', tutorId: 't1', date: '2026-02-20', startTime: '17:00', endTime: '18:00', isBooked: true },
  { id: 'ts3', tutorId: 't1', date: '2026-02-21', startTime: '16:00', endTime: '17:00', isBooked: false },
  { id: 'ts4', tutorId: 't2', date: '2026-02-20', startTime: '15:00', endTime: '16:00', isBooked: false },
  { id: 'ts5', tutorId: 't2', date: '2026-02-21', startTime: '16:00', endTime: '17:00', isBooked: false },
];

// ============================================
// Mock Lessons
// ============================================
export const mockLessons: Lesson[] = [
  {
    id: 'l1',
    booking: {
      id: 'b1',
      parentId: 'p1',
      studentId: 's1',
      tutorId: 't1',
      slot: mockTimeSlots[1],
      subject: 'math',
      status: 'confirmed',
      price: 120,
    },
    tutor: mockTutors[0],
    student: mockStudents[0],
    date: '2026-02-20',
    startTime: '17:00',
    endTime: '18:00',
    subject: 'math',
    status: 'upcoming',
  },
  {
    id: 'l2',
    booking: {
      id: 'b2',
      parentId: 'p1',
      studentId: 's1',
      tutorId: 't2',
      slot: mockTimeSlots[4],
      subject: 'english',
      status: 'confirmed',
      price: 100,
    },
    tutor: mockTutors[1],
    student: mockStudents[0],
    date: '2026-02-21',
    startTime: '16:00',
    endTime: '17:00',
    subject: 'english',
    status: 'upcoming',
  },
];

// ============================================
// Mock Pricing Plans
// ============================================
export const mockPricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    nameHe: 'חינם',
    price: 0,
    period: 'month',
    features: [
      'תרגול בסיסי בכל המקצועות',
      'עד 10 תרגילים ביום',
      'משוב AI בסיסי',
      'מעקב התקדמות בסיסי',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    nameHe: 'פרימיום',
    price: 49,
    period: 'month',
    features: [
      'תרגול ללא הגבלה',
      'משוב AI מתקדם ומותאם אישית',
      'דוחות התקדמות מפורטים',
      'המלצות AI חכמות',
      'גישה לכל הנושאים המתקדמים',
      'תמיכה בעדיפות',
      'ללא פרסומות',
    ],
    isPopular: true,
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    nameHe: 'פרימיום שנתי',
    price: 39,
    period: 'month',
    features: [
      'כל היתרונות של פרימיום',
      'חיסכון של 20%',
      'שיעור ניסיון חינם עם מורה',
      'גישה מוקדמת לתכנים חדשים',
    ],
  },
];

// ============================================
// Mock Earnings
// ============================================
export const mockEarnings: EarningsData[] = [
  { month: 'ספט׳', gross: 4800, commission: 720, net: 4080, lessonsCount: 40 },
  { month: 'אוק׳', gross: 5200, commission: 780, net: 4420, lessonsCount: 43 },
  { month: 'נוב׳', gross: 4600, commission: 690, net: 3910, lessonsCount: 38 },
  { month: 'דצמ׳', gross: 3800, commission: 570, net: 3230, lessonsCount: 32 },
  { month: 'ינו׳', gross: 5600, commission: 840, net: 4760, lessonsCount: 47 },
  { month: 'פבר׳', gross: 4200, commission: 630, net: 3570, lessonsCount: 35 },
];

// ============================================
// Mock Testimonials
// ============================================
export const mockTestimonials: Testimonial[] = [
  {
    id: 'test1',
    name: 'שירה גולדברג',
    role: 'אמא ליואב, כיתה ד׳',
    content: 'מאז שיואב התחיל להשתמש בפלטפורמה, הציונים שלו עלו משמעותית. הוא אפילו מבקש לתרגל! ה-AI מזהה בדיוק איפה הוא מתקשה.',
    avatar: '',
    rating: 5,
  },
  {
    id: 'test2',
    name: 'אבי מלכה',
    role: 'אבא לנועה, כיתה ג׳',
    content: 'הפלטפורמה פשוט מדהימה. המורה הפרטי שמצאנו דרך המערכת היה מושלם. הממשק נקי ופשוט, ונועה אוהבת את מערכת הנקודות.',
    avatar: '',
    rating: 5,
  },
  {
    id: 'test3',
    name: 'ד״ר מיכל אברהם',
    role: 'מורה פרטית למתמטיקה',
    content: 'כמורה פרטית, המערכת עוזרת לי לנהל את כל התלמידים במקום אחד. לוח הזמנים, התשלומים, והמעקב - הכל אוטומטי ומקצועי.',
    avatar: '',
    rating: 5,
  },
];

// ============================================
// Mock FAQ
// ============================================
export const mockFAQ: FAQItem[] = [
  {
    question: 'איך מערכת ה-AI עובדת?',
    answer: 'מערכת ה-AI שלנו מנתחת את ביצועי התלמיד בזמן אמת, מזהה נקודות חולשה, ומתאימה את רמת הקושי והתכנים באופן אוטומטי. המערכת נותנת משוב מיידי ומותאם אישית לכל תלמיד.',
  },
  {
    question: 'האם הפלטפורמה מתאימה לכל הכיתות?',
    answer: 'כן! הפלטפורמה מותאמת לתלמידי כיתות א׳ עד ו׳ בכל המקצועות. התכנים מותאמים לתכנית הלימודים של משרד החינוך.',
  },
  {
    question: 'איך מוצאים מורה פרטי?',
    answer: 'פשוט גלשו למאגר המורים, סננו לפי מקצוע, כיתה ותקציב, ובחרו מורה שמתאים לכם. אפשר לראות דירוגים, ביקורות וניסיון של כל מורה.',
  },
  {
    question: 'כמה עולה המנוי?',
    answer: 'יש לנו תוכנית חינמית עם תרגול בסיסי, ותוכנית פרימיום ב-49 ₪ לחודש שכוללת תרגול ללא הגבלה, משוב AI מתקדם, ודוחות מפורטים. ניתן לבטל בכל עת.',
  },
  {
    question: 'האם המידע של הילד שלי מאובטח?',
    answer: 'בהחלט. אנחנו משתמשים בהצפנה מתקדמת ועומדים בתקני אבטחת מידע מחמירים. המידע של ילדכם לעולם לא ישותף עם צדדים שלישיים.',
  },
  {
    question: 'איך מורים פרטיים מצטרפים לפלטפורמה?',
    answer: 'מורים יכולים להירשם בחינם, למלא את הפרופיל שלהם, ולהתחיל לקבל תלמידים. אנחנו גובים עמלה של 15% מכל שיעור. אין דמי הצטרפות.',
  },
];

// ============================================
// Admin Stats
// ============================================
export const mockAdminStats = {
  totalUsers: 12847,
  totalStudents: 8923,
  totalParents: 3124,
  totalTutors: 800,
  activeSubscriptions: 2156,
  monthlyRevenue: 105720,
  monthlyGrowth: 12.5,
  pendingApprovals: 23,
  averageRating: 4.7,
  totalLessons: 15620,
};
