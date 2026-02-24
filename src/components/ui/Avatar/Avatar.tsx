import styles from './Avatar.module.scss';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline';
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);
}

function getColorFromName(name: string): string {
  const colors = ['#2563EB', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#EC4899'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({ name, src, size = 'md', status, className = '' }: AvatarProps) {
  return (
    <div className={`${styles.avatar} ${styles[size]} ${className}`}>
      {src ? (
        <img src={src} alt={name} className={styles.image} />
      ) : (
        <div className={styles.initials} style={{ backgroundColor: getColorFromName(name) }}>
          {getInitials(name)}
        </div>
      )}
      {status && <span className={`${styles.status} ${styles[status]}`} />}
    </div>
  );
}
