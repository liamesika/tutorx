import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/marketing/Hero';
import HomeTrustStrip from '@/components/marketing/HomeTrustStrip';
import HomeHowItWorks from '@/components/marketing/HomeHowItWorks';
import HomeSubjects from '@/components/marketing/HomeSubjects';
import HomeTutorPreview from '@/components/marketing/HomeTutorPreview';
import HomePricing from '@/components/marketing/HomePricing';
import HomeZoom from '@/components/marketing/HomeZoom';
import FAQ from '@/components/marketing/FAQ';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Tutorix — תרגול חכם לתלמידי א׳–ו׳ + מורים פרטיים בזום',
  description:
    'תרגול חינמי בכל המקצועות עם משוב AI מיידי. הזמינו מורה פרטי לשיעור בזום — ישירות מהפלטפורמה. דירוגים אמיתיים, תשלום מאובטח.',
  openGraph: {
    title: 'Tutorix — תרגול חכם לתלמידי א׳–ו׳ + מורים פרטיים בזום',
    description:
      'תרגול חינמי בכל המקצועות עם משוב AI מיידי. מורים פרטיים מאומתים בזום.',
    type: 'website',
    locale: 'he_IL',
    siteName: 'Tutorix',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tutorix — תרגול חכם + מורים פרטיים בזום',
    description:
      'תרגול חינמי בכל המקצועות עם משוב AI מיידי. הזמינו מורה פרטי לשיעור בזום.',
  },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HomeTrustStrip />
        <HomeHowItWorks />
        <HomeSubjects />
        <HomeTutorPreview />
        <HomePricing />
        <HomeZoom />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
