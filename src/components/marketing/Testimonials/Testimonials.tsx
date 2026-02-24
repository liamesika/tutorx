import { mockTestimonials } from '@/data/mock';
import Avatar from '@/components/ui/Avatar';
import StarRating from '@/components/ui/StarRating';
import styles from './Testimonials.module.scss';

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>מה אומרים עלינו</span>
          <h2 className={styles.title}>
            הורים ומורים <span className={styles.accent}>ממליצים</span>
          </h2>
        </div>
        <div className={styles.grid}>
          {mockTestimonials.map((testimonial) => (
            <div key={testimonial.id} className={styles.card}>
              <StarRating rating={testimonial.rating} size="sm" showValue={false} />
              <p className={styles.content}>&quot;{testimonial.content}&quot;</p>
              <div className={styles.author}>
                <Avatar name={testimonial.name} size="sm" />
                <div>
                  <p className={styles.name}>{testimonial.name}</p>
                  <p className={styles.role}>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
