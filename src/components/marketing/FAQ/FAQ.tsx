'use client';

import { useState } from 'react';
import { mockFAQ } from '@/data/mock';
import styles from './FAQ.module.scss';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>שאלות נפוצות</span>
          <h2 className={styles.title}>
            יש לכם <span className={styles.accent}>שאלות?</span>
          </h2>
        </div>
        <div className={styles.list}>
          {mockFAQ.map((item, index) => (
            <div
              key={index}
              className={`${styles.item} ${openIndex === index ? styles.open : ''}`}
            >
              <button
                className={styles.question}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{item.question}</span>
                <span className={styles.chevron}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className={styles.answer}>
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
