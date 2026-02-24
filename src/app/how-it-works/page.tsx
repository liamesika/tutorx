import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import {
  UserPlus, Bot, Trophy, BarChart3,
  Users, TrendingUp, GraduationCap, Star,
  ClipboardList, CheckCircle, Calendar, Wallet,
  Backpack, BookOpen,
} from 'lucide-react';
import styles from './page.module.scss';

const studentSteps = [
  { icon: <UserPlus size={22} strokeWidth={1.75} />, title: 'נרשמים', desc: 'יוצרים חשבון בחינם ובוחרים כיתה ומקצועות.' },
  { icon: <Bot size={22} strokeWidth={1.75} />, title: 'מתרגלים עם AI', desc: 'המערכת מתאימה שאלות לרמה שלכם ונותנת משוב מיידי.' },
  { icon: <Trophy size={22} strokeWidth={1.75} />, title: 'צוברים XP', desc: 'כל תשובה נכונה נותנת נקודות. עולים ברמות ושומרים על רצף.' },
  { icon: <BarChart3 size={22} strokeWidth={1.75} />, title: 'רואים התקדמות', desc: 'דוחות שבועיים עם תובנות AI לגבי נקודות חולשה וחוזק.' },
];

const parentSteps = [
  { icon: <UserPlus size={22} strokeWidth={1.75} />, title: 'מוסיפים ילד', desc: 'מחברים את חשבון הילד ורואים את ההתקדמות בדשבורד.' },
  { icon: <TrendingUp size={22} strokeWidth={1.75} />, title: 'עוקבים בזמן אמת', desc: 'גרפים, ניתוחים והמלצות AI — הכל בלוח בקרה אחד.' },
  { icon: <GraduationCap size={22} strokeWidth={1.75} />, title: 'מזמינים מורה', desc: 'מוצאים מורה פרטי מתאים, בוחרים זמן ומזמינים בלחיצה.' },
  { icon: <Star size={22} strokeWidth={1.75} />, title: 'רואים תוצאות', desc: 'תלמידים שמשתמשים בפלטפורמה משפרים ציונים ב-35% בממוצע.' },
];

const tutorSteps = [
  { icon: <ClipboardList size={22} strokeWidth={1.75} />, title: 'נרשמים כמורה', desc: 'ממלאים פרופיל, מגדירים מקצועות ומחיר שעתי.' },
  { icon: <CheckCircle size={22} strokeWidth={1.75} />, title: 'מאושרים', desc: 'הצוות שלנו מאשר את הפרופיל תוך 24 שעות.' },
  { icon: <Calendar size={22} strokeWidth={1.75} />, title: 'מגדירים זמינות', desc: 'קובעים שעות זמינות בלוח שנה חכם.' },
  { icon: <Wallet size={22} strokeWidth={1.75} />, title: 'מרוויחים', desc: 'מקבלים תלמידים, מלמדים ומרוויחים. עמלה של 15% בלבד.' },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>
              איך <span className={styles.accent}>Tutorix</span> עובד?
            </h1>
            <p className={styles.subtitle}>
              פלטפורמה אחת. שלוש חוויות מותאמות. לתלמידים, הורים ומורים.
            </p>
          </div>
        </section>

        {/* Student Journey */}
        <section className={styles.journey}>
          <div className={styles.container}>
            <div className={styles.journeyHeader}>
              <div className={styles.journeyIcon}>
                <Backpack size={22} strokeWidth={1.75} />
              </div>
              <h2>מסע התלמיד</h2>
            </div>
            <div className={styles.stepsGrid}>
              {studentSteps.map((step, i) => (
                <div key={i} className={styles.stepCard}>
                  <div className={styles.stepNumber}>{i + 1}</div>
                  <div className={styles.stepIcon}>{step.icon}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parent Journey */}
        <section className={`${styles.journey} ${styles.alt}`}>
          <div className={styles.container}>
            <div className={styles.journeyHeader}>
              <div className={styles.journeyIcon} data-variant="accent">
                <Users size={22} strokeWidth={1.75} />
              </div>
              <h2>מסע ההורה</h2>
            </div>
            <div className={styles.stepsGrid}>
              {parentSteps.map((step, i) => (
                <div key={i} className={styles.stepCard}>
                  <div className={styles.stepNumber}>{i + 1}</div>
                  <div className={styles.stepIcon} data-variant="accent">{step.icon}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tutor Journey */}
        <section className={styles.journey}>
          <div className={styles.container}>
            <div className={styles.journeyHeader}>
              <div className={styles.journeyIcon} data-variant="cyan">
                <BookOpen size={22} strokeWidth={1.75} />
              </div>
              <h2>מסע המורה</h2>
            </div>
            <div className={styles.stepsGrid}>
              {tutorSteps.map((step, i) => (
                <div key={i} className={styles.stepCard}>
                  <div className={styles.stepNumber}>{i + 1}</div>
                  <div className={styles.stepIcon} data-variant="cyan">{step.icon}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2>מוכנים להתחיל?</h2>
            <p>הצטרפו לאלפי משפחות שכבר משתמשות ב-Tutorix</p>
            <div className={styles.ctaButtons}>
              <Link href="/signup">
                <Button size="lg">הרשמה חינם</Button>
              </Link>
              <Link href="/tutors">
                <Button variant="secondary" size="lg">חפשו מורה</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
