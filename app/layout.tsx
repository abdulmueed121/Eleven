import type { Metadata } from 'next';
import { Geist, Playfair_Display } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-sans', subsets: ['latin'] });
const display = Playfair_Display({ variable: '--font-display', subsets: ['latin'] });

export const metadata: Metadata = { title: { default: 'ELEVEN — Technology built with ownership.', template: '%s — ELEVEN' }, description: 'ELEVEN designs, engineers, launches and operates serious digital products, platforms and infrastructure.', metadataBase: new URL('https://eleven.example'), openGraph: { title: 'ELEVEN — Technology built with ownership.', description: 'Product, engineering, infrastructure and growth under one roof.', type: 'website', images: ['/og.png'] }, twitter: { card: 'summary_large_image', images: ['/og.png'] }, icons: { icon: '/favicon.ico' } };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${display.variable}`}>{children}</body>
    </html>
  );
}
