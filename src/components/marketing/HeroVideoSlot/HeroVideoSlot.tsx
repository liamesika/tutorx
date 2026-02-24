'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './HeroVideoSlot.module.scss';

interface HeroVideoSlotProps {
  videoSrc?: string;
  posterSrc?: string;
  className?: string;
}

export default function HeroVideoSlot({
  videoSrc = '/media/home/hero.mp4',
  posterSrc = '/media/home/hero-poster.png',
  className = '',
}: HeroVideoSlotProps) {
  const [hasVideo, setHasVideo] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, [reducedMotion]);

  return (
    <div className={`${styles.slot} ${className}`}>
      {hasVideo && !reducedMotion ? (
        <video
          ref={videoRef}
          className={styles.video}
          src={videoSrc}
          poster={posterSrc}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          onError={() => setHasVideo(false)}
        />
      ) : (
        <div className={styles.fallback}>
          <Image
            src={posterSrc}
            alt="Tutorix — תרגול חכם לתלמידי יסודי"
            fill
            className={styles.fallbackImage}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className={styles.fallbackOverlay} />
        </div>
      )}
    </div>
  );
}
