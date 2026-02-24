'use client';

import { useState } from 'react';
import { mockTutors, subjects as subjectList, gradeNames } from '@/data/mock';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { UserCircle, Link2 } from 'lucide-react';
import styles from './page.module.scss';

export default function TutorProfilePage() {
  const tutor = mockTutors[0];
  const [bio, setBio] = useState(tutor.bio);
  const [hourlyRate, setHourlyRate] = useState(tutor.hourlyRate.toString());
  const [zoomLink, setZoomLink] = useState('');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1><UserCircle size={20} strokeWidth={1.75} /> ניהול פרופיל</h1>
        <p>ערכו את הפרופיל המקצועי שלכם</p>
      </div>

      {/* Photo & Basic info */}
      <Card className={styles.photoSection}>
        <div className={styles.photoContainer}>
          <Avatar name={tutor.name} size="xl" />
          <div className={styles.photoActions}>
            <Button variant="secondary" size="sm">העלאת תמונה</Button>
            <Button variant="ghost" size="sm">העלאת סרטון הצגה</Button>
          </div>
        </div>
        <div className={styles.basicInfo}>
          <Input label="שם מלא" value={tutor.name} fullWidth />
          <Input label="אימייל" value={tutor.email} type="email" fullWidth />
        </div>
      </Card>

      {/* Zoom link */}
      <Card className={styles.section}>
        <h3><Link2 size={18} strokeWidth={1.75} /> קישור Zoom לשיעורים</h3>
        <p className={styles.sectionDesc}>
          הוסיפו את קישור הזום האישי שלכם. הקישור יישלח אוטומטית לתלמידים שהזמינו שיעור.
        </p>
        <Input
          label="קישור Zoom"
          placeholder="https://zoom.us/j/..."
          value={zoomLink}
          onChange={(e) => setZoomLink(e.target.value)}
          fullWidth
        />
      </Card>

      {/* Bio */}
      <Card className={styles.section}>
        <h3>תיאור מקצועי</h3>
        <div className={styles.textareaWrapper}>
          <textarea
            className={styles.textarea}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="ספרו על עצמכם, השיטות שלכם והניסיון..."
          />
          <span className={styles.charCount}>{bio.length}/500</span>
        </div>
      </Card>

      {/* Subjects & Grades */}
      <Card className={styles.section}>
        <h3>מקצועות</h3>
        <div className={styles.tags}>
          {subjectList.map((subject) => (
            <button
              key={subject.id}
              className={`${styles.tag} ${tutor.subjects.includes(subject.id as never) ? styles.tagActive : ''}`}
            >
              {subject.nameHe}
            </button>
          ))}
        </div>

        <h3 className={styles.mt}>כיתות</h3>
        <div className={styles.tags}>
          {Object.entries(gradeNames).map(([grade, name]) => (
            <button
              key={grade}
              className={`${styles.tag} ${tutor.grades.includes(Number(grade) as never) ? styles.tagActive : ''}`}
            >
              {name}
            </button>
          ))}
        </div>
      </Card>

      {/* Pricing */}
      <Card className={styles.section}>
        <h3>תמחור</h3>
        <div className={styles.pricing}>
          <Input
            label="מחיר לשעה (₪)"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
          <div className={styles.pricingInfo}>
            <p>הכנסה נטו לשעה (אחרי עמלה 15%):</p>
            <span className={styles.netPrice}>
              ₪{Math.round(Number(hourlyRate) * 0.85)}
            </span>
          </div>
        </div>
      </Card>

      {/* Experience */}
      <Card className={styles.section}>
        <h3>ניסיון</h3>
        <div className={styles.experience}>
          <Badge variant="primary">{tutor.experience} שנות ניסיון</Badge>
          <Badge variant="success">{tutor.reviewCount} ביקורות</Badge>
          <Badge variant="accent">דירוג {tutor.rating}</Badge>
        </div>
      </Card>

      {/* Save */}
      <div className={styles.actions}>
        <Button size="lg">שמירת שינויים</Button>
        <Button variant="ghost" size="lg">ביטול</Button>
      </div>
    </div>
  );
}
