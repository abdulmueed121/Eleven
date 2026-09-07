import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const instrument = localFont({
  src: './fonts/instrument-sans-2.woff2',
  weight: '400 700',
  style: 'normal',
  variable: '--font-instrument',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: 'ELEVEN — Technology built with ownership.',
    template: '%s — ELEVEN',
  },
  description:
    'ELEVEN designs, engineers, launches and operates serious digital products, platforms and infrastructure.',
  metadataBase: new URL('https://elev1.us'),
  openGraph: {
    title: 'ELEVEN — Technology built with ownership.',
    description:
      'Product, engineering, infrastructure and growth under one roof.',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'ELEVEN — Technology built with ownership.',
      },
    ],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
  icons: { icon: '/favicon.ico', shortcut: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrument.variable}>
      <body>{children}</body>
    </html>
  );
}
