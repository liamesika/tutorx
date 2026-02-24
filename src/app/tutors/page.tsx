'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TutorCard from '@/components/tutor/TutorCard';
import Input from '@/components/ui/Input';
import { Search } from 'lucide-react';
import { mockTutors, subjects } from '@/data/mock';
import styles from './page.module.scss';

export default function TutorsPage() {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredTutors = mockTutors.filter((tutor) => {
    const matchesSearch = tutor.name.includes(search) || tutor.bio.includes(search);
    const matchesSubject = selectedSubject === 'all' || tutor.subjects.includes(selectedSubject as never);
    return matchesSearch && matchesSubject;
  });

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.title}>
              מורים פרטיים <span className={styles.accent}>מובילים</span>
            </h1>
            <p className={styles.subtitle}>
              מצאו את המורה המושלם לילד שלכם מתוך מאגר של 800+ מורים מאומתים
            </p>
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.container}>
            <div className={styles.filters}>
              <Input
                placeholder="חפשו מורה לפי שם..."
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

            <div className={styles.results}>
              <p className={styles.count}>נמצאו {filteredTutors.length} מורים</p>
              <div className={styles.grid}>
                {filteredTutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
