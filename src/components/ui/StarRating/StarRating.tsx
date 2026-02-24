import styles from './StarRating.module.scss';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  showValue = true,
  size = 'md',
  className = '',
}: StarRatingProps) {
  return (
    <div className={`${styles.wrapper} ${styles[size]} ${className}`}>
      <div className={styles.stars}>
        {Array.from({ length: maxRating }, (_, i) => {
          const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;
          return (
            <span key={i} className={styles.star}>
              <span className={styles.empty}>★</span>
              <span
                className={styles.filled}
                style={{ width: `${fillPercentage}%` }}
              >
                ★
              </span>
            </span>
          );
        })}
      </div>
      {showValue && <span className={styles.value}>{rating.toFixed(1)}</span>}
    </div>
  );
}
