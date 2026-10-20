import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'JSTQB AL TM 学習支援Webアプリ | テストマネージャ合格サポート',
  description: 'JSTQB Advanced Level テストマネージャ（AL TM）合格に向け、「見る（読む）」「解く」「聴く（聞き流し）」の3軸で網羅的に学習できる環境を提供。',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'JSTQB AL TM',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 antialiased overscroll-none">
        <Navbar />
        <main className="flex-1 pb-[env(safe-area-inset-bottom)]">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <p>© JSTQB AL TM 学習支援Webアプリケーション - JSTQB FL / AL TM シラバス準拠</p>
        </footer>
      </body>
    </html>
  );
}

