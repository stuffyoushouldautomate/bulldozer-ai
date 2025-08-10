import './globals.css';
import 'katex/dist/katex.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'sonner';

import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://bulldozer-brain.local825.com'),
  title: {
    default: 'Bulldozer Brain - Local 825',
    template: '%s | Bulldozer Brain',
    absolute: 'Bulldozer Brain - Local 825',
  },
  description: 'Bulldozer Brain is Local 825\'s AI-powered research platform for labor organizing, company analysis, and strategic intelligence gathering.',
  openGraph: {
    url: 'https://bulldozer-brain.local825.com',
    siteName: 'Bulldozer Brain - Local 825',
  },
  keywords: [
    'local 825',
    'bulldozer brain',
    'labor union research',
    'company analysis',
    'union organizing',
    'labor intelligence',
    'worker organizing',
    'corporate research',
    'union strategy',
    'labor organizing tools',
    'company profiles',
    'union research platform',
    'labor organizing ai',
    'worker power',
    'collective bargaining research',
    'corporate accountability',
    'labor rights research',
    'union data analysis',
    'organizing intelligence',
    'worker solidarity',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F9F9F9' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  preload: true,
  weight: 'variable',
  display: 'swap',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  variable: '--font-be-vietnam-pro',
  preload: true,
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${beVietnamPro.variable} font-sans antialiased`} suppressHydrationWarning>
        <NuqsAdapter>
          <Providers>
            <Toaster position="top-center" />
            {children}
          </Providers>
        </NuqsAdapter>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
