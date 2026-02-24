import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import PageReveal from "@/components/ui/PageReveal";
import "./globals.scss";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tutorix - פלטפורמת הלמידה החכמה",
  description:
    "פלטפורמת למידה מבוססת AI לתלמידי יסודי, עם מורים פרטיים מובילים. תרגול חכם, משוב מיידי, והתקדמות אמיתית.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={heebo.variable}>
          <AuthProvider><PageReveal>{children}</PageReveal></AuthProvider>
        </body>
    </html>
  );
}
