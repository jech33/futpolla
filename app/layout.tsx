import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { NextHydrationWaiter } from '@/components/auth/NextHydrationWaiter';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Futpolla - World Cup 2026',
  description:
    'Stay updated with the latest fixtures for the FIFA World Cup 2026. View match dates, times, and predict results all in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${poppins.className} antialiased`}>
        <NextHydrationWaiter>
          <AuthGuard>{children}</AuthGuard>
        </NextHydrationWaiter>
      </body>
    </html>
  );
}
