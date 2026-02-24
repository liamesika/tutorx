'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './PageReveal.module.scss';

interface PageRevealProps {
  children: ReactNode;
}

export default function PageReveal({ children }: PageRevealProps) {
  const pathname = usePathname();
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [pathname]);

  return (
    <div key={animKey} className={styles.reveal}>
      {children}
    </div>
  );
}
