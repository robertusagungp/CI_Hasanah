import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Simulasi Perlindungan Finansial Hasanah | Interactive Life Story Simulator',
  description:
    'Simulasi interaktif untuk memahami cara kerja perlindungan finansial dan alur manfaat perlindungan secara mudah, visual, dan transparan.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#FBFBFA] text-slate-900 antialiased selection:bg-brand-100 selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}
