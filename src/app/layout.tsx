import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import MSWProvider from '@/components/providers/MSWProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LiveClass 학습 플래너',
  description: '30분 단위 학습 계획을 관리하는 스터디 플래너',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MSWProvider>
          <QueryProvider>{children}</QueryProvider>
        </MSWProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
