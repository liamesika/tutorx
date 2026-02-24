'use client';

import { useState } from 'react';
import { mockTutors, mockTimeSlots, subjects } from '@/data/mock';
import TutorCard from '@/components/tutor/TutorCard';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { GraduationCap, Search, Star } from 'lucide-react';
import styles from './page.module.scss';

export default function BookTutorPage() {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTutor, setSelectedTutor] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);

  const filteredTutors = mockTutors.filter((t) => {
    const matchSearch = t.name.includes(search) || t.bio.includes(search);
    const matchSubject = selectedSubject === 'all' || t.subjects.includes(selectedSubject as never);
    return matchSearch && matchSubject && t.isAvailable;
  });

  const tutor = mockTutors.find((t) => t.id === selectedTutor);
  const tutorSlots = mockTimeSlots.filter((s) => s.tutorId === selectedTutor && !s.isBooked);

  const handleBook = async () => {
    if (!tutor || !selectedSlot) return;
    setBooking(true);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lesson',
          tutorId: tutor.id,
          slotId: selectedSlot,
          subject: tutor.subjects[0] ?? 'שיעור',
          price: tutor.hourlyRate,
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setBooking(false);
    }
  };

  if (selectedTutor && tutor) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => { setSelectedTutor(null); setSelectedSlot(null); }}>
          → חזרה לרשימת המורים
        </button>

        <Card className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <Avatar name={tutor.name} size="xl" />
            <div>
              <h2>{tutor.name}</h2>
              <p className={styles.profileBio}>{tutor.bio}</p>
              <div className={styles.profileMeta}>
                <Badge variant="primary">₪{tutor.hourlyRate}/שעה</Badge>
                <Badge variant="success">{tutor.experience} שנות ניסיון</Badge>
                <Badge variant="accent"><Star size={14} strokeWidth={1.75} /> {tutor.rating}</Badge>
              </div>
            </div>
          </div>
        </Card>

        <div className={styles.section}>
          <h3>בחרו זמן:</h3>
          <div className={styles.slotsGrid}>
            {tutorSlots.length === 0 ? (
              <p className={styles.noSlots}>אין זמנים פנויים כרגע</p>
            ) : (
              tutorSlots.map((slot) => (
                <button
                  key={slot.id}
                  className={`${styles.slotBtn} ${selectedSlot === slot.id ? styles.slotSelected : ''}`}
                  onClick={() => setSelectedSlot(slot.id)}
                >
                  <span className={styles.slotDate}>{slot.date}</span>
                  <span className={styles.slotTime}>{slot.startTime} - {slot.endTime}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {selectedSlot && (
          <div className={styles.confirm}>
            <Card className={styles.confirmCard}>
              <h3>אישור הזמנה</h3>
              <div className={styles.confirmDetails}>
                <p>מורה: <strong>{tutor.name}</strong></p>
                <p>מחיר: <strong>₪{tutor.hourlyRate}</strong></p>
                <p>זמן: <strong>{tutorSlots.find((s) => s.id === selectedSlot)?.date} {tutorSlots.find((s) => s.id === selectedSlot)?.startTime}</strong></p>
              </div>
              <Button fullWidth size="lg" onClick={handleBook} disabled={booking}>
                {booking ? 'מעבד תשלום...' : 'אישור ותשלום'}
              </Button>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1><GraduationCap size={22} strokeWidth={1.75} /> הזמנת מורה פרטי</h1>
        <p>מצאו את המורה המושלם לילד שלכם</p>
      </div>

      <div className={styles.filters}>
        <Input
          placeholder="חפשו מורה..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={18} strokeWidth={1.75} />}
          fullWidth
        />
        <div className={styles.subjectFilters}>
          <button
            className={`${styles.filterBtn} ${selectedSubject === 'all' ? styles.active : ''}`}
            onClick={() => setSelectedSubject('all')}
          >
            הכל
          </button>
          {subjects.map((subject) => (
            <button
              key={subject.id}
              className={`${styles.filterBtn} ${selectedSubject === subject.id ? styles.active : ''}`}
              onClick={() => setSelectedSubject(subject.id)}
            >
              {subject.nameHe}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredTutors.map((tutor) => (
          <div key={tutor.id} onClick={() => setSelectedTutor(tutor.id)} style={{ cursor: 'pointer' }}>
            <TutorCard tutor={tutor} />
          </div>
        ))}
      </div>
    </div>
  );
}
