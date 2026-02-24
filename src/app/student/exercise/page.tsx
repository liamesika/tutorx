'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockExercises } from '@/data/mock';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import { PartyPopper, Zap, Bot, Lightbulb, GraduationCap } from 'lucide-react';
import styles from './page.module.scss';

export default function ExercisePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const exercise = mockExercises[currentIndex];
  const isCorrect = selectedAnswer === exercise?.correctAnswer;
  const totalQuestions = mockExercises.length;
  const isFinished = currentIndex >= totalQuestions;

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === exercise.correctAnswer) {
      setScore((s) => s + 1);
      setXpEarned((x) => x + exercise.xpReward);
    }
  };

  const handleNext = () => {
    setCurrentIndex((i) => i + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (isFinished) {
    return (
      <div className={styles.page}>
        <div className={styles.summary}>
          <div className={styles.summaryIcon}><PartyPopper size={32} strokeWidth={1.75} /></div>
          <h1>כל הכבוד!</h1>
          <p>סיימת את התרגול</p>
          <div className={styles.summaryStats}>
            <div className={styles.summaryStat}>
              <span className={styles.summaryValue}>{score}/{totalQuestions}</span>
              <span className={styles.summaryLabel}>תשובות נכונות</span>
            </div>
            <div className={styles.summaryStat}>
              <span className={styles.summaryValue}>+{xpEarned}</span>
              <span className={styles.summaryLabel}>XP</span>
            </div>
          </div>
          <div className={styles.summaryActions}>
            <Link href="/student/summary">
              <Button size="lg">צפה בסיכום מפורט</Button>
            </Link>
            <Link href="/student">
              <Button variant="secondary" size="lg">חזרה לתפריט</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Progress bar */}
      <div className={styles.topBar}>
        <ProgressBar
          value={currentIndex + 1}
          max={totalQuestions}
          size="sm"
          variant="primary"
        />
        <div className={styles.topInfo}>
          <span>שאלה {currentIndex + 1} מתוך {totalQuestions}</span>
          <Badge variant="accent" size="sm"><Zap size={14} strokeWidth={1.75} /> +{exercise.xpReward} XP</Badge>
        </div>
      </div>

      {/* Question */}
      <div className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <Badge variant="primary">
            {exercise.subject === 'math' ? 'מתמטיקה' :
             exercise.subject === 'hebrew' ? 'עברית' :
             exercise.subject === 'english' ? 'אנגלית' :
             exercise.subject === 'science' ? 'מדעים' : exercise.subject}
          </Badge>
          <Badge variant={exercise.difficulty === 'easy' ? 'success' : exercise.difficulty === 'medium' ? 'warning' : 'error'} size="sm">
            {exercise.difficulty === 'easy' ? 'קל' : exercise.difficulty === 'medium' ? 'בינוני' : 'קשה'}
          </Badge>
        </div>
        <h2 className={styles.question}>{exercise.question}</h2>

        {/* Options */}
        <div className={styles.options}>
          {exercise.options?.map((option) => {
            let optionClass = styles.option;
            if (isAnswered) {
              if (option === exercise.correctAnswer) {
                optionClass += ` ${styles.correct}`;
              } else if (option === selectedAnswer) {
                optionClass += ` ${styles.wrong}`;
              }
            } else if (option === selectedAnswer) {
              optionClass += ` ${styles.selected}`;
            }

            return (
              <button
                key={option}
                className={optionClass}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
            <span className={styles.feedbackIcon}>
              {isCorrect ? <Bot size={20} strokeWidth={1.75} /> : <Lightbulb size={20} strokeWidth={1.75} />}
            </span>
            <div>
              <p className={styles.feedbackTitle}>
                {isCorrect ? 'מצוין! תשובה נכונה!' : 'לא נכון, אבל זה בסדר!'}
              </p>
              <p className={styles.feedbackText}>
                {isCorrect
                  ? `קיבלת +${exercise.xpReward} XP! המשך כך!`
                  : `התשובה הנכונה היא: ${exercise.correctAnswer}`}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        {isAnswered && (
          <div className={styles.actions}>
            <Button onClick={handleNext} fullWidth size="lg">
              {currentIndex < totalQuestions - 1 ? 'שאלה הבאה ←' : 'סיים תרגול'}
            </Button>
          </div>
        )}
      </div>

      {/* Need help */}
      <div className={styles.helpBar}>
        <p>צריכים עזרה נוספת?</p>
        <Link href="/parent/book-tutor">
          <Button variant="ghost" size="sm"><GraduationCap size={16} strokeWidth={1.75} /> הזמינו שיעור פרטי</Button>
        </Link>
      </div>
    </div>
  );
}
